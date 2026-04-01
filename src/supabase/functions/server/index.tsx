import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-0c75c66f/health", (c) => {
  return c.json({ status: "ok" });
});

// Eircode lookup endpoint - lookup address by Eircode
app.get("/make-server-0c75c66f/eircode-lookup", async (c) => {
  try {
    const eircode = c.req.query('eircode');
    
    if (!eircode || eircode.length < 7) {
      return c.json({ error: 'Invalid Eircode' }, 400);
    }

    // Clean Eircode (remove spaces, uppercase)
    const cleanEircode = eircode.replace(/\s/g, '').toUpperCase();

    // Strategy 1: Try postcode search
    let searchUrl = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(cleanEircode)}&country=Ireland&format=json&addressdetails=1&limit=5`;
    
    let response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'ReturnKit-Childcare-Tracker/1.0'
      }
    });

    if (!response.ok) {
      console.error('Eircode lookup API error:', response.status);
      return c.json({ error: 'Eircode lookup service unavailable' }, 503);
    }

    let data = await response.json();

    // Strategy 2: If no results, try searching with Eircode as part of address query
    if (!data || data.length === 0) {
      console.log('Postcode search failed, trying general search for:', cleanEircode);
      searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanEircode)}, Dublin, Ireland&format=json&addressdetails=1&limit=5`;
      
      response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'ReturnKit-Childcare-Tracker/1.0'
        }
      });

      if (!response.ok) {
        return c.json({ error: 'Eircode lookup service unavailable' }, 503);
      }

      data = await response.json();
    }

    // Strategy 3: Try without "Ireland" to cast wider net
    if (!data || data.length === 0) {
      console.log('Second search failed, trying broader search for:', cleanEircode);
      searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanEircode)}, Dublin&countrycodes=ie&format=json&addressdetails=1&limit=5`;
      
      response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'ReturnKit-Childcare-Tracker/1.0'
        }
      });

      if (!response.ok) {
        return c.json({ error: 'Eircode lookup service unavailable' }, 503);
      }

      data = await response.json();
    }

    if (!data || data.length === 0) {
      console.log('All search strategies failed for Eircode:', cleanEircode);
      return c.json({ 
        error: 'Address not found for this Eircode. OpenStreetMap may not have this Eircode in its database yet. Please enter the address manually.' 
      }, 404);
    }

    // Filter for Dublin results
    const dublinResults = data.filter((item: any) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);
      return lat >= 53.0 && lat <= 53.6 && lng >= -6.6 && lng <= -5.9;
    });

    if (dublinResults.length === 0) {
      return c.json({ error: 'This Eircode does not appear to be in Dublin' }, 400);
    }

    const location = dublinResults[0];
    const lat = parseFloat(location.lat);
    const lng = parseFloat(location.lon);

    console.log(`Eircode lookup success: ${cleanEircode} -> ${lat}, ${lng}`);

    return c.json({
      success: true,
      address: formatAddress(location),
      eircode: cleanEircode,
      lat,
      lng,
      rawAddress: location.address
    });
  } catch (error) {
    console.error('Eircode lookup error:', error);
    return c.json({ error: 'Eircode lookup failed' }, 500);
  }
});

// Address autocomplete/search endpoint
app.get("/make-server-0c75c66f/address-search", async (c) => {
  try {
    const query = c.req.query('q');
    
    if (!query || query.length < 3) {
      return c.json({ suggestions: [] });
    }

    // Search for addresses in Dublin, Ireland using Nominatim
    const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Dublin, Ireland&countrycodes=ie&addressdetails=1&limit=10`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'ReturnKit-Childcare-Tracker/1.0'
      }
    });

    if (!response.ok) {
      console.error('Address search API error:', response.status);
      return c.json({ suggestions: [] });
    }

    const data = await response.json();

    // Format suggestions with full address
    const suggestions = data
      .filter((item: any) => {
        // Only include results in Dublin area
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        return lat >= 53.0 && lat <= 53.6 && lng >= -6.6 && lng <= -5.9;
      })
      .map((item: any) => ({
        displayName: item.display_name,
        address: item.address,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        // Try to extract EIRCODE from address details if available
        postcode: item.address?.postcode || null,
        formattedAddress: formatAddress(item)
      }));

    return c.json({ suggestions });
  } catch (error) {
    console.error('Address search error:', error);
    return c.json({ suggestions: [] });
  }
});

// Helper function to format address nicely
function formatAddress(item: any) {
  const parts = [];
  const addr = item.address;
  
  if (addr?.house_number && addr?.road) {
    parts.push(`${addr.house_number} ${addr.road}`);
  } else if (addr?.road) {
    parts.push(addr.road);
  } else if (addr?.neighbourhood) {
    parts.push(addr.neighbourhood);
  }
  
  if (addr?.suburb) {
    parts.push(addr.suburb);
  } else if (addr?.neighbourhood && !parts.includes(addr.neighbourhood)) {
    parts.push(addr.neighbourhood);
  }
  
  if (addr?.city_district) {
    parts.push(addr.city_district);
  }
  
  // Add Dublin and postal code
  parts.push('Dublin');
  
  if (addr?.postcode) {
    parts.push(addr.postcode);
  }
  
  return parts.join(', ');
}

// Get all community crèches
app.get("/make-server-0c75c66f/creches", async (c) => {
  try {
    const creches = await kv.getByPrefix("creche:");
    return c.json({ creches: creches || [] });
  } catch (error) {
    console.error("Error fetching crèches:", error);
    return c.json({ error: "Failed to fetch crèches", details: String(error) }, 500);
  }
});

// Add a new community crèche
app.post("/make-server-0c75c66f/creches", async (c) => {
  try {
    const body = await c.req.json();
    const { name, address, eircode, status, lat, lng } = body;

    // Validate required fields
    if (!name || !address || !eircode || !status) {
      return c.json({ error: "Missing required fields: name, address, eircode, status" }, 400);
    }

    // Validate EIRCODE format (Irish postcode: A65 F4E2 format)
    const eircodePattern = /^[A-Z]\d{2}\s?[A-Z0-9]{4}$/i;
    if (!eircodePattern.test(eircode.replace(/\s/g, ''))) {
      return c.json({ error: "Invalid EIRCODE format. Expected format: A65 F4E2" }, 400);
    }

    // Validate status
    if (!['green', 'amber', 'red'].includes(status)) {
      return c.json({ error: "Invalid status. Must be 'green', 'amber', or 'red'" }, 400);
    }

    // Geocode and validate the address
    let validatedLat = lat;
    let validatedLng = lng;
    
    try {
      // Use Nominatim (OpenStreetMap) for geocoding
      const geocodeQuery = `${address}, ${eircode}, Ireland`;
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(geocodeQuery)}&countrycodes=ie&limit=1`;
      
      const geocodeResponse = await fetch(geocodeUrl, {
        headers: {
          'User-Agent': 'ReturnKit-Childcare-Tracker/1.0'
        }
      });

      if (!geocodeResponse.ok) {
        console.error('Geocoding API error:', geocodeResponse.status);
        return c.json({ 
          error: "Address validation service unavailable. Please try again later." 
        }, 503);
      }

      const geocodeData = await geocodeResponse.json();

      if (!geocodeData || geocodeData.length === 0) {
        return c.json({ 
          error: "Address could not be validated. Please check the address and EIRCODE are correct and try again. Make sure to include the full address (street, area, Dublin)." 
        }, 400);
      }

      // Get the first result
      const location = geocodeData[0];
      validatedLat = parseFloat(location.lat);
      validatedLng = parseFloat(location.lon);

      // Validate it's actually in Dublin (rough bounding box)
      // Dublin is roughly: lat 53.2-53.5, lng -6.5 to -6.0
      if (validatedLat < 53.0 || validatedLat > 53.6 || validatedLng < -6.6 || validatedLng > -5.9) {
        return c.json({ 
          error: "Address does not appear to be in Dublin. ReturnKit currently only supports Dublin crèches." 
        }, 400);
      }

      console.log(`Address validated: ${address} -> ${validatedLat}, ${validatedLng}`);
    } catch (geocodeError) {
      console.error('Geocoding error:', geocodeError);
      return c.json({ 
        error: "Address validation failed. Please check your address and EIRCODE and try again." 
      }, 400);
    }

    // Create creche object
    const creche = {
      id: `creche:${Date.now()}`,
      name,
      address,
      eircode: eircode.toUpperCase().replace(/\s/g, ''),
      status,
      lat: validatedLat,
      lng: validatedLng,
      addedDate: new Date().toISOString(),
      contributorCount: 1
    };

    // Store in KV
    await kv.set(creche.id, creche);

    return c.json({ success: true, creche });
  } catch (error) {
    console.error("Error adding crèche:", error);
    return c.json({ error: "Failed to add crèche", details: String(error) }, 500);
  }
});

// Update crèche status (for community validation/updates)
app.put("/make-server-0c75c66f/creches/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { status } = body;

    // Validate status
    if (!['green', 'amber', 'red'].includes(status)) {
      return c.json({ error: "Invalid status. Must be 'green', 'amber', or 'red'" }, 400);
    }

    // Get existing creche
    const existing = await kv.get(`creche:${id}`);
    if (!existing) {
      return c.json({ error: "Crèche not found" }, 404);
    }

    // Update status and increment contributor count
    const updated = {
      ...existing,
      status,
      contributorCount: (existing.contributorCount || 1) + 1,
      lastUpdated: new Date().toISOString()
    };

    await kv.set(`creche:${id}`, updated);

    return c.json({ success: true, creche: updated });
  } catch (error) {
    console.error("Error updating crèche:", error);
    return c.json({ error: "Failed to update crèche", details: String(error) }, 500);
  }
});

// Submit research contribution (anonymized maternal workforce data)
app.post("/make-server-0c75c66f/research-contribution", async (c) => {
  try {
    const body = await c.req.json();
    const {
      region,
      industry_sector,
      salary_band,
      monthly_childcare_cost_band,
      childcare_type,
      maternity_leave_weeks,
      return_to_work_status,
      work_arrangement,
      hours_per_week
    } = body;

    // Validate required fields
    if (!industry_sector || !salary_band || !monthly_childcare_cost_band || !return_to_work_status || !work_arrangement) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create research contribution object
    const contribution = {
      id: `research:${Date.now()}:${Math.random().toString(36).substring(7)}`,
      country: "Ireland",
      region: region || "Dublin",
      industry_sector,
      salary_band,
      monthly_childcare_cost_band,
      childcare_type,
      maternity_leave_weeks: maternity_leave_weeks || null,
      return_to_work_status,
      work_arrangement,
      hours_per_week: hours_per_week || null,
      created_at: new Date().toISOString()
    };

    // Store in KV
    await kv.set(contribution.id, contribution);

    console.log(`Research contribution stored: ${contribution.id}`);

    return c.json({ success: true, contribution_id: contribution.id });
  } catch (error) {
    console.error("Error storing research contribution:", error);
    return c.json({ error: "Failed to store research contribution", details: String(error) }, 500);
  }
});

// Get aggregated research statistics (for future admin dashboard)
app.get("/make-server-0c75c66f/research-stats", async (c) => {
  try {
    const contributions = await kv.getByPrefix("research:");
    
    const stats = {
      total_contributions: contributions.length,
      by_industry: {} as Record<string, number>,
      by_salary_band: {} as Record<string, number>,
      by_work_arrangement: {} as Record<string, number>,
      by_return_status: {} as Record<string, number>
    };

    contributions.forEach((contrib: any) => {
      // Count by industry
      if (contrib.industry_sector) {
        stats.by_industry[contrib.industry_sector] = (stats.by_industry[contrib.industry_sector] || 0) + 1;
      }
      
      // Count by salary band
      if (contrib.salary_band) {
        stats.by_salary_band[contrib.salary_band] = (stats.by_salary_band[contrib.salary_band] || 0) + 1;
      }
      
      // Count by work arrangement
      if (contrib.work_arrangement) {
        stats.by_work_arrangement[contrib.work_arrangement] = (stats.by_work_arrangement[contrib.work_arrangement] || 0) + 1;
      }
      
      // Count by return status
      if (contrib.return_to_work_status) {
        stats.by_return_status[contrib.return_to_work_status] = (stats.by_return_status[contrib.return_to_work_status] || 0) + 1;
      }
    });

    return c.json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching research stats:", error);
    return c.json({ error: "Failed to fetch research stats", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
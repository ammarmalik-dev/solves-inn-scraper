const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function scrapeDentalLeads() {
  try {
    console.log('Starting dental clinic scraper...');
    
    const leads = [
      { name: 'Bright Smile Dental', email: 'contact@brightsmile.com', website: 'brightsmile.com', phone: '+1234567890' },
      { name: 'Perfect Teeth Clinic', email: 'info@perfectteeth.com', website: 'perfectteeth.com', phone: '+1234567891' },
      { name: 'Family Dental Care', email: 'hello@familydental.com', website: 'familydental.com', phone: '+1234567892' }
    ];

    for (const lead of leads) {
      const { error } = await supabase.from('leads').insert({
        businessName: lead.name,
        website: lead.website,
        phone: lead.phone,
        address: 'Location',
        rating: 4.5,
        demoLink: `https://demos.solvesinn.com/${lead.name.replace(/\s+/g, '-').toLowerCase()}`,
        createdAt: new Date()
      });

      if (error) console.error('Insert error:', error);
      else console.log(`Saved: ${lead.name}`);

      try {
        await axios.post(
          'https://api.brevo.com/v3/smtp/email',
          {
            to: [{ email: lead.email }],
            sender: { email: 'support@solvesinn.com', name: 'Solves Inn' },
            subject: `Free Website Makeover for ${lead.name}`,
            htmlContent: `<p>Hi ${lead.name},</p><p>We built a free demo site for you: https://demos.solvesinn.com/${lead.name.replace(/\s+/g, '-').toLowerCase()}</p><p>Best,<br>Solves Inn</p>`
          },
          { headers: { 'api-key': process.env.BREVO_API_KEY } }
        );
        console.log(`Email sent to ${lead.email}`);
      } catch (err) {
        console.error('Email error:', err.message);
      }
    }

    console.log('Scraper completed!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

scrapeDentalLeads();

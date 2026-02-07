import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-11-20.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const { bundle_id, amount } = await req.json()

    // Create a Checkout Session with ui_mode=custom for Express Checkout Element
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'custom',
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Unlock Content',
              description: `Bundle: ${bundle_id}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      return_url: `https://smashx.fun/?bundle_id=${bundle_id}&payment=success`,
      metadata: {
        bundle_id: bundle_id,
      },
    })

    return new Response(
      JSON.stringify({
        clientSecret: session.client_secret,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
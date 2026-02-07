#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Deploying create-payment-intent Edge Function to Supabase...${NC}"

# Login to Supabase (using your token)
export SUPABASE_ACCESS_TOKEN="sbp_7eeba9aa2c995b07e3d36e3027dcbf804d5ce507"

# Link to your project
supabase link --project-ref nsqowxwwtmxvahhmigap

# Set the Stripe secret key as a secret
echo -e "${BLUE}Setting Stripe secret key...${NC}"
echo "Please set your Stripe secret key manually:"
echo "supabase secrets set STRIPE_SECRET_KEY=your_key_here"

# Deploy the function
echo -e "${BLUE}Deploying function...${NC}"
supabase functions deploy create-payment-intent

echo -e "${GREEN}✓ Deployment complete!${NC}"
echo -e "${BLUE}Function URL: https://nsqowxwwtmxvahhmigap.supabase.co/functions/v1/create-payment-intent${NC}"
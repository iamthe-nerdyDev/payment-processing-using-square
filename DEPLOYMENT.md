# Deploy Service on Render

Deploy the payment gateway server and a managed PostgreSQL database with one click:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/iamthe-nerdyDev/payment-processing-using-square)

## Post-Deployment Setup

-   Navigate to project's web service on Render
-   Go to the "Environment" tab
-   Update the following required variables:
    -   `SQUARE_ACCESS_TOKEN`: Square Developer access token
    -   Verify other environment variables are set correctly
-   Save, rebuild, and deploy

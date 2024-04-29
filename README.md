## Inspiration
Food waste represents a significant market and environmental failure, leading to the disposal of over US $1 trillion worth of food annually. It accounts for an estimated 8–10 percent of global greenhouse gas emissions and occupies nearly 30 percent of the world’s agricultural land. This waste not only contributes to habitat loss due to the conversion of natural ecosystems for agriculture but also highlights a profound social issue: while vast amounts of food are discarded, approximately 783 million people suffer from hunger each year, and 150 million children under five experience stunted growth due to nutritional deficiencies.

The UNEP Report clarifies the difference between food waste and food loss. Food waste pertains to food that is discarded or uneaten at the retail and consumption stages. In contrast, food loss occurs during production, storage, processing, and distribution phases. The report, released on March 27, specifically addresses food waste. [Read More](https://wellbeingintl.org/the-food-waste-challenge/?gad_source=1&gclid=CjwKCAjwoa2xBhACEiwA1sb1BLGjX91VOgb2mIOxLPsJB9VgLmQwBqTpNQtwECQgm2yU5cGPZoxoKhoCMsAQAvD_BwE)

## What It Does
We developed a model that predicts the supply and demand for groceries and implemented a discounting algorithm to maximize revenue while minimizing losses. This algorithm enhances demand by offering discounts and calculates the optimal discount rate to both maximize revenue and minimize surplus by the expiry date. Moreover, we have integrated a feature that allows discounts to be directed to local food charities, supporting the use of expired groceries.

## How We Built It
The application was built using React and Node.js for the user interface, with Python powering the advanced discounting algorithm. This algorithm analyzes batch inventory data from the Square inventories API and models potential changes. It then generates discount suggestions that can be seamlessly integrated into the existing discounts page. More details on the discounting algorithm can be found below

## Challenges We Ran Into
Currently, the Square API does not support the creation of coupon codes, requiring store owners to manually input discounts. This limitation presents a significant challenge in automating the discount process.

## Accomplishments That We're Proud Of
*(This section is pending details about specific achievements or milestones reached during the project.)*

## What We Learned
*(This section should include insights, techniques learned, or understanding gained during the project.)*

## What's Next for Square Coupons
*(This section should outline future plans for the development and enhancement of the Square Coupons feature.)*

## Miscellaneous

## Discounting Algorithm
Calculating the suggested discounts is no trivial task. For a given product, the algorithm first compares the expected sales by expiration (`expected_sales_by_expiration`) to the current count of the product that is going to expire (`count_exp`). If `expected_sales_by_expiration` is greater than `count_exp`, then there is no need to discount the product. Otherwise, we need to consider discounting the product in question. Since `expected_sales_by_expiration` and `count_exp` are not explicitly provided by the Square API, we need to deduce these values from the data we do have access to. See **Estimating expected_sales_by_expiration** and **Estimating count_exp** below.

After identifying that a store can benefit from discounting a given product, we iterate through each potential discounted price from 0% off to 100% off. For each percent discount, we find the expected revenue by multiplying the discounted price and the expected sales in quantity at the discounted price. For an explanation on how the latter is determined, see **Calculating Expected Sales at Discounted Price** below. We see at which percent discount we maximize the revenue and suggest the percent discount to the user, the shop.

![Revenue Optimization Graph](blob:https://devpost.com/524ec369-a699-426c-bb86-574cf69d79ad)
*The chart displays where revenue is maximized for the example data.*

## Estimating expected_sales_by_expiration

We estimate `expected_sales_by_expiration` by multiplying the remaining days to expiration (`dte`) and the expected sales in quantity per day of the soon to expire count.

Since `dte` is not explicitly provided by the Square API, days to expiration is estimated in the following manner:

1. Restocks are somewhat periodic and consistent in amount and the number of days a product lasts before expiration upon delivery to the store is fairly consistent per product.
2. Patterns in recent past data on losses can be extrapolated to predict the current days to expiration.
3. Within a period between two restock events, the loss event or group of loss events with the greatest quantity lost is due to inventory expiring.

Next, we look at past data to extrapolate `dte`. In the 6 most recent restock events (which we take from the Square API), we average days past between loss events and their respective most recent restock event. These averages are quadratically weighted averages based on amount lost per loss event. We quadratically weight averages to further attenuate the smaller losses, which concurs with the third assumption. The effect of quadratically weighting the losses to obtain the average number of days since the last restock can be shown in the example below.

![Example of Weighted Average Calculation](URL-to-example)
*This example is only for the time between two restock events. In practice, we average the weighted averages among each period of consecutive restock events to obtain the average.*

We take this value and subtract the number of days since the last restock event. Since the difference can be negative, we apply the modulus function to the difference with the average number of days between consecutive restock events. This new value is `dte`. The modulus function can be used because the number of days a product takes to expire since its delivery to the store can be longer than the number of days between two or more consecutive restock events. Applying the modulus function covers these cases and is appropriate for the method we calculate `dte`. Note that this relies on the first assumption.

To calculate the expected sales in quantity per day of the soon to expire count, we get sales data from the Square API. We take all sales made from the last 2 times `dte` days and get an average sales per day. The average is calculated by weighting the most recent sales more heavily as more recent data is more relevant to the sellability of a product.

## Estimate count_exp

Note that for a given product, the current inventory count is not a sufficient estimate for `count_exp` as the inventory may have a mix of soon to expire items and recently restocked items. To calculate the `count_exp`, we simply calculate the average quantity loss per consecutive restock events across the last 6 restock events. To do this, we obtain the data from the Square API.

## Calculating Expected Sales at Discounted Price

In order to calculate the expected sales in quantity at the discounted price, we need some insight as to the effect of discounts on sales. In order to create a model for a general product, we mined the internet for data. We also had to clean the data so that variables were consistent. For example, 75% of the original price should translate to 25% off and a 67% increase in sales should be a multiplier of 1.67. Any suggested formulas were turned into a set of 50 data points. We tried to diversify the products being studied to create a more general model for simplicity. Once the data points were plotted we were able to formulate an equation that models the general effect of discounts on sales.

![Discount Impact on Sales Data Points](output.png)


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

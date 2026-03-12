# Currency Converter App

This project is a simple **Currency Converter mobile application**.

## Tech Stack

- React Native
- Expo
- TypeScript
- Open Exchange Rates API
- Supabase (data persistence) – I chose Supabase because I already have experience using it, although mostly for image storage
- React Navigation
- Lucide React Native (icons)
- Jest (testing)

## AI Collaboration

This project was also an experiment in working with **AI-assisted development**.

Inside **VS Code** I used an AI agent powered by **Claude Sonnet 4.6**, which helped with generating and refactoring code and suggesting improvements directly in the editor.

For discussions such as **application architecture, project structure, and selecting libraries**, I used **ChatGPT 5.3**.

## Prompts used

### Architecture

To explore the architecture of the application I asked ChatGPT the following prompt:

```text
Design a solution for an Expo React Native application written in TypeScript for currency conversion.

The user enters an amount, selects a source currency and a target currency, and the application displays the converted result.

Use https://openexchangerates.org as the API.

Also solve data persistence using Supabase so that conversion history remains available even if the app crashes or the user logs in from another device.

The application should also display statistics:
- Most frequently used target currency
- Total sum of all conversions (in USD)
- Total number of conversions
```

### Generating the first screen

```text
I am building a small React Native app with Expo and TypeScript. The app is a simple currency converter.

I want to create the first screen called ConverterScreen.

Requirements:
- Use React Native with TypeScript
- The screen should contain:
  - A title "Purple currency converter"
  - An input for "Amount to convert"
  - A select for "From currency"
  - A select for "To currency"
  - A button "Convert currency"
  - A result card showing:
    - converted value
    - number of calculations made

UI notes:
- The inputs and pickers should be inside a purple card
- The result should be displayed below in a white card
- Keep the layout simple and clean using StyleSheet

Generate:
- A ConverterScreen.tsx component (in src/screens)
- A simple list of example currencies (USD, EUR, CZK)
- Basic state for amount, fromCurrency, toCurrency and result
```

The prompt worked well and produced a good initial component structure.
However, the generated code used SafeAreaView from react-native, which is deprecated in modern Expo projects.
I corrected this by replacing it with SafeAreaView from react-native-safe-area-context.

### Connecting to the exchange rate API

I asked the VS Code AI agent to replace the mock currency data with real data from the OpenExchangeRates API.

```text
Replace mock currency data with live data from the OpenExchangeRates API and implement a professional currency selection + conversion flow.

The API base currency is USD.

Use the OpenExchangeRates endpoints.

Do not introduce unnecessary libraries.

The API key is stored in .env as:
EXPO_PUBLIC_OPEN_EXCHANGE_KEY

Access it using:
process.env.EXPO_PUBLIC_OPEN_EXCHANGE_KEY

Create: src/services/exchangeApi.ts and add there two functions

fetchRates()
Fetch latest exchange rates from:
https://openexchangerates.org/api/latest.json
Return only the rates object.

fetchCurrencies()
Fetch currency list from:
https://openexchangerates.org/api/currencies.json

USD is the base currency.
```

The AI connected the app to the API correctly and generated a working service layer.

However, the generated code returned the rates using a TypeScript type assertion:

```ts
return data.rates as Record<string, number>;
```

I generally try to avoid using as type assertions because they bypass TypeScript’s type safety.
For that reason I removed the as assertion.

### Refactoring a component

I also used the AI agent to help with a small refactoring of the code.

```text
Create StatCard.tsx in src/components and move the component from StatsScreen.tsx there and then use it in the StatsScreen component
```

This prompt worked very well. The AI correctly extracted the StatCard component into a separate file and updated StatsScreen to use the new component.

### Generating tests

I also used the AI agent to help generate tests.

```text
I have created a StatsScreen.test.tsx. Create a similar test file for ConverterScreen.tsx and a test file for functions exchangeApi.ts.
```

This prompt worked extremely well and was one of the most surprising results during development.

## Notes on AI-assisted development

This was my first time working with **Claude Sonnet 4.6**, and overall the experience was very positive. It was particularly helpful for generating initial code structures, refactoring components, and creating tests.

One issue I noticed was **inconsistency in shared values**, especially with styling.

For example, in the first component the AI generated, some colors were defined as `const` values inside the component while others were hardcoded directly in the styles. Later, when generating another component, the same colors were defined again as new constants inside that component.

This resulted in duplicated color definitions across multiple components.

To resolve this, I created a shared `colors.ts` file and moved all reusable colors there so they could be imported and used consistently across the application.

## Running the project

To run this project you need to provide the required API keys.

The real keys are stored in a local `.env` file which is not included in the repository.

`.env.example` file is provided that contains the required environment variable names without values.  
You can copy this file and fill in your own API keys.

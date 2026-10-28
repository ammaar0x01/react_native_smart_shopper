# System documentation

Shopping List
---

## Notes
- This app uses Expo 57 
- sitemap: http://localhost:8081/_sitemap 
- Enter '192.168...' IP address to access view the web-version on any device on the same network    
    example of url: '192.168.10.138:8081'
---


## Screenshots

Here is a quick preview of UI in desktop view: 

| Landing Page | Home View |
| :---: | :---: |
| ![Landing Page](/public/screenshots/desktop/landing-page.png) | ![Home View](/public/screenshots/desktop/home.png) |

| Search Products | Store Locator |
| :---: | :---: |
| ![Search Products](/public/screenshots/desktop/search-products.png) | ![Store Locator](/public/screenshots/desktop/store-locator.png) |

| Shopping Cart | Sell an Item |
| :---: | :---: |
| ![Shopping Cart](/public/screenshots/desktop/your-shopping-cart.png) | ![Sell an Item](/public/screenshots/desktop/sell-an-item.png) |

| User Account | |
| :---: | :---: |
| ![Account](/public/screenshots/desktop/account.png) | |
---


## Naming Conventions 

```
Different files have different naming styles

- .ts files:         
   + camel case
   + used for TS logic 

- .tsx files:        
   + camel case
   + used for components or views
   + views (or pages; files that represent a page in the app) MUST have an exported functions that follows this syntax: 
      > ' export default function CartView() { ... } '
      > it must have a main function with the 'View' suffix
      > the main function must be in Pascal Case
      > NOTE: the 'view' suffix should not be used for layout files

- .styles.ts files: 
   + camel case
   + used to style views or components 
   + export const stylesCart = StyleSheet.create({

- .css files:      
   + kebab case
   + used for generic styles 
```
---


## More notes 
- The 'ignore' folder, in 'app' folder, is used for experimental views/pages 
- The only views that are visible on the mobile app is in the '(tabs)' folder (in 'app' folder)
- Special style files:
   + _layout.styles.ts
   + global.styles.ts
   + themeDefault.styles.ts
- The '(tabs)' folder in /src/app are for the tabs in the bottom navbar for the mobile app (2-5 tabs)
---



## Learn more

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

> Build and export a React native app 


npm install -g eas-cli

eas login

eas build:configure

eas build --platform android

eas build --platform ios


Step 5: Export for Web

If you want to deploy your shopping list app as a static website, Expo can bundle your code into HTML, CSS, and JS assets:

    Run the export command:npx expo export

    This creates a dist folder in your project root containing your complete production-ready web app.

    You can deploy this dist folder to any static hosting provider like Vercel, Netlify, or GitHub Pages.
---

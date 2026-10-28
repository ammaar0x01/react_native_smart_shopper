# Smart Shopper 
- Started: 2026-10-26
- Updated: 2026-10-28
- Version: 0.3
- Status: work-in-progress
---

## Notes
- This app uses Expo 57 
- sitemap: http://localhost:8081/_sitemap 
- Enter '192.168...' IP address to access view the web-version on any device on the same network    
    example of url: '192.168.10.138:8081'
---


## Screenshots
### Desktop (Web App)
| Wide | Narrow |
| :---: | :---: |
| ![Main Page](/public/screenshots/web-app-desktop-wide.png) | ![Main Page](/public/screenshots/web-app-desktop-narrow.png) |


### Mobile App
| Main | Notes |
| :---: | :---: |
| ![Main Page](/public/screenshots/mobile-app1.jpeg) | ![Notes](/public/screenshots/mobile-app2.jpeg) |

---


## Installation and Execution
1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).


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
---

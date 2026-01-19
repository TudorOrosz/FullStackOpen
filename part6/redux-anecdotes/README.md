# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## How does this app work with Redux
Explaining a bit about how this whole reducer things works. So, as we said we have a store. (example is from the redux-anecdotes app - before starting to work on ex 6.3-6.8). The store is created in main.jsx and the reducer that is imported is:
import reducer from './reducers/anecdoteReducer'
Now,  the store is created with this reducer in mind, or based on this reducer doesn't matter how you want to formulate it. And the provider function gives the state to the components. Now if we go back in the App component, the anecdotes variable is populated like this:
const anecdotes = useSelector(state => state)
Which basically means that it is using the value from the store, given by the reducer function, which is the 
anecdoteReducer
function from the anecdoteReducer.js file. Which has an initial state. And can change based on actions.

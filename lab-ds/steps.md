```bash
# Create project
npm create vite@latest

# Install base dependencies
npm install tailwindcss postcss autoprefixer -D

# Initialize the tailwind
npx tailwindcss init -p

# Minimum configuration of the tailwind.config.cjs
module.exports.content[0] = './src/**/*.tsx'

# Initialize storybook
npx storybook init --builder @storybook/builder-vite --use-npm

# Install mini variant library builder 
npm install clsx
```

* **Create src/styles/global.css**
```css
@tailwind base;
@tailwind utilities;
@tailwind components;
```

# Referencias

- [Design Figma](https://www.figma.com/file/8kntFxJ3KtVG2grQbqdoqf/Ignite-Lab---Design-System?node-id=2%3A179)

# fillout_take_home_dg
Software engineering screen

# Build steps
Localhost:3000  (or PORT in .env file)
1) `npm i`
2) `npm run dev`

Prodcution build
1) `npm run build`
2) `npm start`


# Notes
1) Make sure .env file is present with `FILLOUT_API_KEY=<insert key>`
2) run dev will run this: `"dev": "nodemon --exec npx ts-node ./src/index.ts"`
3) Some comments were left in place for debugging purposes. 

## Example 1 - Executing query with localhost from Postman using filters and limit params
`www.localhost:3000/cLZojxk94ous/filteredResponses?filters=%5B%7B%22id%22%3A%224KC356y4M6W8jHPKx9QfEy%22%2C%22condition%22%3A%22equals%22%2C%22value%22%3A%22Nothing%20much%20to%20share%20yet!%22%7D%5D&limit=150`

## Example 2 - Production build on Renderer
`https://fillout-take-home-dg.onrender.com/cLZojxk94ous/filteredResponses?filters=%5B%7B%22id%22%3A%224KC356y4M6W8jHPKx9QfEy%22%2C%22condition%22%3A%22equals%22%2C%22value%22%3A%22Nothing%20much%20to%20share%20yet!%22%7D%5D&limit=150`

Note: Free instance on Renderer will spin down with inactivity, which can delay requests by 50 seconds or more

## Credits: 
Sample TS Node Express project found here: https://github.com/c99rahul/ts-node-express


Thanks!!

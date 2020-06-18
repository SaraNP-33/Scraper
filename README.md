# AllRecipes Scraper

This app scrapes information from the website Allrecipes and renders it in handlebars. From there the user can either go to the website and see the recipe and/or save it. When the recipe is saved the user can go to the saved page and add a note or delete it.

The user can also delete all the scraped items and scrape again for new and fresh recipes. 

# Sample Images

Below are some gifs to exemplify the functionality of this app.

## Scrape recipes

When the user hits the scrape button it will hit the scrape route that uses axios to fetch the information and cheerio to parse through it and deliver the content.

![scrape](./public/assets/images/scraperecipes.gif)
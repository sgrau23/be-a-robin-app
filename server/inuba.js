import Future from 'fibers/future';
import fetch from 'node-fetch';

const {
  url, codeClient, codeCenter, codeDevice, categories,
} = Meteor.settings.inuba;

export const getProductProposal = (userPreferences) => {
  const future = new Future();
  // Define required body with user preferences
  const body = {
    id_language: 1,
    age: 37,
    id_gender: 1,
    height: 171,
    weight: 65,
    id_goal: 3,
    id_life_style: 1,
    id_days_phys: 1,
    id_hours_phys: 1,
    id_diet_variety: 1,
    id_daily_food: 1,
    id_diet_type: 8,
    local_time: '2022-08-01 6:52:30',
    aversions: [28, 151],
    diseases: [2],
    intolerances: [7],
  };
  const headers = {
    'Content-Type': 'application/json',
    x_code_device: codeDevice,
    x_code_client: codeClient,
    x_code_center: codeCenter,
  };
  // Make curl request
  fetch(
    url,
    {
      method: 'post',
      headers,
      body: JSON.stringify(body),
    },
  )
    .then((r) => r.json())
    .then((r) => future.return(r))
    .catch((error) => { console.error(error); future.return(); });
  const response = future.wait();
  // Obtain only products with their categories
  const products = {};
  const names = [];
  response.foods.forEach((element) => {
    const key = categories[element.id_food_super_family];
    if (key in products) {
      if (!names.includes(element.food_name)) {
        products[key].push({
          name: element.food_name,
          category: key,
        });
      }
    } else {
      products[key] = [{
        name: element.food_name,
        category: key,
      }];
    }
    names.push(element.food_name);
  });
  return products;
};


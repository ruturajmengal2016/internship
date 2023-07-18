const express = require("express");
const app = express();
app.use(express.json());

app.get("/", async (req, res, next) => {
  try {
    const response = await fetch(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json",
      { method: "GET" }
    );
    const data = await response.json();
    res.render("index.ejs", { name: "Ruturaj Mengal", data: data });
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/pie", async (req, res) => {
  const response = await fetch(
    "https://s3.amazonaws.com/roxiler.com/product_transaction.json",
    { method: "GET" }
  );
  const data = await response.json();
  let values = new Set();
  let obj = {};
  for (let i = 0; i < data.length; i++) {
    values.add(data[i].category);
  }
  for (let i = 0; i < data.length; i++) {
    if (Object.keys(obj).includes(data[i].category)) {
      obj[data[i].category] += 1;
    } else {
      obj[data[i].category] = 0;
    }
  }
  //   const data = [30, 50, 70, 90]; // Sample data for the pie chart
  let send = Object.values(obj);
  res.render("pieChart", { data: send, keys: Object.keys(obj) });
});

app.get("/bar", async (req, res) => {
  try {
    const response = await fetch(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json",
      { method: "GET" }
    );
    const data = await response.json();
    let values = [];
    for (let i = 0; i < data.length; i++) {
      values.push(data[i].price);
    }
    res.render("barChart.ejs", { data: values, maxDataValue: values.length });
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/fetch", async (req, res, next) => {
  try {
    const response = await fetch(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json",
      { method: "GET" }
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/stat", async (req, res, next) => {
  try {
    const response = await fetch(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json",
      { method: "GET" }
    );
    const data = await response.json();
    let sold_items = 0;
    let not_sold = 0;
    function soldItems(month = 1) {
      data.forEach((element) => {
        if (
          element.sold &&
          month == new Date(element.dateOfSale).getMonth() + 1
        ) {
          sold_items += 1;
        } else {
          not_sold += 1;
        }
      });
    }
    soldItems();
    res.render("statistics.ejs", {
      sales: sold_items + not_sold,
      sold_items: sold_items,
      items: not_sold,
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.set("view engine", "ejs");

app.listen(5000, () => {
  console.log("server start");
});

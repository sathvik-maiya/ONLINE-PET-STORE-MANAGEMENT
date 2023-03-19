import utils from "/js/util.js";

let cart;
//petfood starts from here

const loadPetFood = function () {
  //  showLoading('#main-content', 'var(--primary-accent)', 5);
  fetch("/service/petfood", {
    method: "GET",
  })
    .then((res) => res.text())
    .then((res) => {
      utils.insertHtml("#main-content", res);
      utils.onclickEvent("#btn-filter-petfood", loadFoodItems);
      loadFoodFilter();
      loadFoodItems();
      // loaddescription
    });
};

const loadFoodItems = () => {
  let filter = getFoodFilter();
  loadData("/petfood", filter).then((data) => {
    loadSnippet("/fooditem")
      .then((res) => {
        var html;
        utils.insertHtml("#pro-container", "");
        for (const petfood of data.petfood) {
          html = utils.insertProperty(res, "id", petfood._id);
          html = utils.insertProperty(html, "name", petfood.foodname);
          html = utils.insertProperty(html, "brand", petfood.brand);
          html = utils.insertProperty(html, "price", petfood.price);
          if (petfood.images.length > 0)
            html = utils.insertProperty(html, "image", petfood.images[0].url);
          utils.appendHtml("#pro-container", html);
        }
      })
      .then((res) => {
        $(".pro > button").each((i, ele) => {
          ele.addEventListener("click", loadFoodDescription);
        });
      });
  });
};

const loadFoodDescription = (e) => {
  getServiceById("petfood", e.target.id).then((data) => {
    loadSnippet("/fooddescription")
      .then((res) => {
        let html = utils.insertProperty(res, "id", data.petfood._id);
        html = utils.insertProperty(html, "name", data.petfood.foodname);
        html = utils.insertProperty(html, "brand", data.petfood.brand);
        html = utils.insertProperty(html, "price", data.petfood.price);
        html = utils.insertProperty(html, "flavor", data.petfood.flavor);
        html = utils.insertProperty(
          html,
          "description",
          data.petfood.description
        );
        if (data.petfood.images.length > 0)
          html = utils.insertProperty(
            html,
            "image",
            data.petfood.images[0].url
          );
        utils.insertHtml("#main-content", html);
      })
      .then((res) => {
        $(`#desc-cart`).each((i, ele) => {
          if (getItemIndex(cart.petfood, data.petfood._id) != -1) {
            $(`#desc-cart`).show();
            $(`#${data.petfood._id}`).hide();
          }
          ele.addEventListener("click", (e) => {
            loadCart();
          });
        });
        $(`#${data.petfood._id}`).each((i, ele) => {
          ele.addEventListener("click", (e) => {
            $(`#desc-cart`).show();
            $(`#${data.petfood._id}`).hide();

            const index = getItemIndex(cart.petfood, e.target.id);
            if (index != -1) cart.petfood[index].quantity += 1;
            else
              cart.petfood.push({
                id: e.target.id,
                quantity: 1,
              });

            localStorage.setItem("cart", JSON.stringify(cart));
          });
        });
      });
  });
};

const loadFoodFilter = () => {
  fetch(utils.apiurl + "/petfood/getflavors")
    .then((res) => res.json())
    .then((res) => {
      let htmlData = "";
      for (let i = 0; i < res.flavors.length; i++)
        htmlData += `<input type="checkbox" name="flavor${i}" value="${res.flavors[i]}">
		<label for="flavor${i}">${res.flavors[i]}</label><br />`;
      utils.insertHtml("#filter-flavors", htmlData);
    });

  fetch(utils.apiurl + "/petfood/getbrands")
    .then((res) => res.json())
    .then((res) => {
      let htmlData = "";
      for (let i = 0; i < res.brands.length; i++)
        htmlData += `<input type="checkbox" name="brand${i}" value="${res.brands[i]}">
		<label for="brand${i}">${res.brands[i]}</label><br />`;
      utils.insertHtml("#filter-brands", htmlData);
      getFoodFilter();
    });
};

const getFoodFilter = () => {
  let filter = {
    price: [0, 1000000],
    brand: [],
    flavor: [],
  };

  $("#filter-flavors > input").each((i, ele) => {
    if (ele.checked) filter.flavor.push(ele.value);
  });
  $("#filter-brands > input").each((i, ele) => {
    if (ele.checked) filter.brand.push(ele.value);
  });
  if ($("#lp").val()) filter.price[0] = parseInt($("#lp").val());
  if ($("#up").val()) filter.price[1] = parseInt($("#up").val());
  return filter;
};

const loadPets = function () {
  //  showLoading('#main-content', 'var(--primary-accent)', 5);
  fetch("/service/pets", {
    method: "GET",
  })
    .then((res) => res.text())
    .then((res) => {
      utils.insertHtml("#main-content", res);
      utils.onclickEvent("#btn-filter-pets", loadPetItems);
      loadPetFilter();
      loadPetItems();
      // loaddescription
    });
};

const loadPetItems = () => {
  let filter = getPetFilter();
  loadData("/pets", filter).then((data) => {
    loadSnippet("/petitem")
      .then((res) => {
        var html;
        utils.insertHtml("#pro-container", "");
        for (const pet of data.pets) {
          html = utils.insertProperty(res, "id", pet._id);
          html = utils.insertProperty(html, "name", pet.petClass);
          html = utils.insertProperty(html, "breed", pet.breed);
          html = utils.insertProperty(html, "price", pet.price);
          if (pet.images.length > 0)
            html = utils.insertProperty(html, "image", pet.images[0].url);
          utils.appendHtml("#pro-container", html);
        }
      })
      .then((res) => {
        $(".pro > button").each((i, ele) => {
          ele.addEventListener("click", loadPetDescription);
        });
      });
  });
};

const loadPetDescription = (e) => {
  getServiceById("pet", e.target.id).then((data) => {
    loadSnippet("/petdescription")
      .then((res) => {
        let html = utils.insertProperty(res, "id", data.pet._id);
        html = utils.insertProperty(html, "name", data.pet.petClass);
        html = utils.insertProperty(html, "brand", data.pet.breed);
        html = utils.insertProperty(html, "price", data.pet.price);
        html = utils.insertProperty(html, "description", data.pet.description);
        if (data.pet.images.length > 0)
          html = utils.insertProperty(html, "image", data.pet.images[0].url);
        utils.insertHtml("#main-content", html);
      })
      .then((res) => {
        $(`#desc-cart`).each((i, ele) => {
          if (getItemIndex(cart.pet, data.pet._id) != -1) {
            $(`#desc-cart`).show();
            $(`#${data.pet._id}`).hide();
          }
          ele.addEventListener("click", (e) => {
            loadCart();
          });
        });
        $(`#${data.pet._id}`).each((i, ele) => {
          ele.addEventListener("click", (e) => {
            $(`#desc-cart`).show();
            $(`#${data.pet._id}`).hide();

            const index = getItemIndex(cart.pet, e.target.id);
            if (index != -1) cart.pet[index].quantity += 1;
            else
              cart.pet.push({
                id: e.target.id,
                quantity: 1,
              });

            localStorage.setItem("cart", JSON.stringify(cart));
          });
        });
      });
  });
};

const loadPetFilter = () => {
  fetch(utils.apiurl + "/pets/getbreeds")
    .then((res) => res.json())
    .then((res) => {
      let htmlData = "";
      for (let i = 0; i < res.breeds.length; i++)
        htmlData += `<input type="checkbox" name="breeds${i}" value="${res.breeds[i]}">
		<label for="breeds${i}">${res.breeds[i]}</label><br />`;
      utils.insertHtml("#filter-breeds", htmlData);
    });

  fetch(utils.apiurl + "/pets/getpetClass")
    .then((res) => res.json())
    .then((res) => {
      let htmlData = "";
      for (let i = 0; i < res.petClass.length; i++)
        htmlData += `<input type="checkbox" name="petClass${i}" value="${res.petClass[i]}">
		<label for="petClass${i}">${res.petClass[i]}</label><br />`;
      utils.insertHtml("#filter-petClass", htmlData);
      getPetFilter();
    });
};

const getPetFilter = () => {
  let filter = {
    price: [0, 1000000],
    breed: [],
    petClass: [],
  };
  $("#filter-breeds > input").each((i, ele) => {
    if (ele.checked) filter.breed.push(ele.value);
  });
  $("#filter-petClass > input").each((i, ele) => {
    if (ele.checked) filter.petClass.push(ele.value);
  });
  if ($("#lp").val()) filter.price[0] = parseInt($("#lp").val());
  if ($("#up").val()) filter.price[1] = parseInt($("#up").val());
  return filter;
};

const loadPetToy = function () {
  fetch("/service/pettoy", {
    method: "GET",
  })
    .then((res) => res.text())
    .then((res) => {
      utils.insertHtml("#main-content", res);
      utils.onclickEvent("#btn-filter-pettoy", loadPetToyItems);
      loadPetToyFilter();
      loadPetToyItems();
      // loaddescription
    });
};

const loadPetToyItems = () => {
  let filter = getPetToyFilter();
  loadData("/pettoy", filter).then((data) => {
    loadSnippet("toyitem")
      .then((res) => {
        var html;
        utils.insertHtml("#pro-container", "");
        for (const pettoy of data.pettoy) {
          html = utils.insertProperty(res, "id", pettoy._id);
          html = utils.insertProperty(html, "name", pettoy.Toyname);
          html = utils.insertProperty(html, "brand", pettoy.brand);
          html = utils.insertProperty(html, "price", pettoy.price);
          if (pettoy.images.length > 0)
            html = utils.insertProperty(html, "image", pettoy.images[0].url);
          utils.appendHtml("#pro-container", html);
        }
      })
      .then((res) => {
        $(".pro > button").each((i, ele) => {
          ele.addEventListener("click", loadPetToyDescription);
        });
      });
  });
};

const loadPetToyDescription = (e) => {
  getServiceById("petToy", e.target.id).then((data) => {
    loadSnippet("/toydescription")
      .then((res) => {
        let html = utils.insertProperty(res, "id", data.pettoy._id);
        html = utils.insertProperty(html, "name", data.pettoy.Toyname);
        html = utils.insertProperty(html, "brand", data.pettoy.brand);
        html = utils.insertProperty(html, "price", data.pettoy.price);
     html = utils.insertProperty(
          html,
          "description",
          data.pettoy.description
        );
        if (data.pettoy.images.length > 0)
          html = utils.insertProperty(html, "image", data.pettoy.images[0].url);
        utils.insertHtml("#main-content", html);
      })
      .then((res) => {
        $(`#desc-cart`).each((i, ele) => {
          if (getItemIndex(cart.pettoy, data.pettoy._id) != -1) {
            $(`#desc-cart`).show();
            $(`#${data.pettoy._id}`).hide();
          }
          ele.addEventListener("click", (e) => {
            loadCart();
          });
        });
        $(`#${data.pettoy._id}`).each((i, ele) => {
          ele.addEventListener("click", (e) => {
            $(`#desc-cart`).show();
            $(`#${data.pettoy._id}`).hide();

            const index = getItemIndex(cart.pettoy, e.target.id);
            if (index != -1) cart.pettoy[index].quantity += 1;
            else
              cart.pettoy.push({
                id: e.target.id,
                quantity: 1,
              });

            localStorage.setItem("cart", JSON.stringify(cart));
          });
        });
      });
  });
};

const loadPetToyFilter = () => {
  fetch(utils.apiurl + "/pettoy/getpetClass")
    .then((res) => res.json())
    .then((res) => {
      let htmlData = "";
      for (let i = 0; i < res.petClass.length; i++)
        htmlData += `<input type="checkbox" name="petClass${i}" value="${res.petClass[i]}">
		<label for="petClass${i}">${res.petClass[i]}</label><br />`;
      utils.insertHtml("#filter-petClass", htmlData);
      getPetFilter();
    });
  fetch(utils.apiurl + "/pettoy/getbrands")
    .then((res) => res.json())
    .then((res) => {
      let htmlData = "";
      for (let i = 0; i < res.brands.length; i++)
        htmlData += `<input type="checkbox" name="brand${i}" value="${res.brands[i]}">
		<label for="brand${i}">${res.brands[i]}</label><br />`;
      utils.insertHtml("#filter-brands", htmlData);
      getFoodFilter();
    });
};

const getPetToyFilter = () => {
  let filter = {
    price: [0, 1000000],
    brand: [],
    petClass: [],
  };
  $("#filter-petClass > input").each((i, ele) => {
    if (ele.checked) filter.petClass.push(ele.value);
  });
  $("#filter-brands > input").each((i, ele) => {
    if (ele.checked) filter.brand.push(ele.value);
  });
  if ($("#lp").val()) filter.price[0] = parseInt($("#lp").val());
  if ($("#up").val()) filter.price[1] = parseInt($("#up").val());
  return filter;
};

const loadPetmed = function () {
  //  showLoading('#main-content', 'var(--primary-accent)', 5);
  loadSnippet("/service/petmedicine").then((res) => {
    utils.insertHtml("#main-content", res);
    utils.onclickEvent("#btn-filter-petmed", loadMeditems);
    loadMeditems();
  });
};

const loadMeditems = function () {
  loadData("/petmedicine").then((data) => {
    loadSnippet("/meditem")
      .then((res) => {
        var html;
        for (const petmedicine of data.petmedicine) {
          html = utils.insertProperty(res, "id", petmedicine._id);
          html = utils.insertProperty(html, "name", petmedicine.medname);
          html = utils.insertProperty(html, "brand", petmedicine.brand);
          html = utils.insertProperty(html, "price", petmedicine.price);
          html = utils.insertProperty(html, "image", petmedicine.images[0].url);
          utils.appendHtml("#pro-container", html);
        }
      })
      .then((res) => {
        $(".pro > button").each((i, ele) => {
          ele.addEventListener("click", loadMedDescription);
        });
      });
  });
};

const loadMedDescription = (e) => {
  getServiceById("petmedicine", e.target.id).then((data) => {
    loadSnippet("/meddescription")
      .then((res) => {
        let html = utils.insertProperty(res, "id", data.petmedicine._id);
        html = utils.insertProperty(html, "name", data.petmedicine.medname);
        html = utils.insertProperty(html, "brand", data.petmedicine.brand);
        html = utils.insertProperty(html, "price", data.petmedicine.price);
        html = utils.insertProperty(html, "dosage", data.petmedicine.dosage);
        html = utils.insertProperty(
          html,
          "description",
          data.petmedicine.description
        );
        if (data.petmedicine.images.length > 0)
          html = utils.insertProperty(
            html,
            "image",
            data.petmedicine.images[0].url
          );
        utils.insertHtml("#main-content", html);
      })
      .then((res) => {
        $(`#desc-cart`).each((i, ele) => {
          if (getItemIndex(cart.petmedicine, data.petmedicine._id) != -1) {
            $(`#desc-cart`).show();
            $(`#${data.petmedicine._id}`).hide();
          }
          ele.addEventListener("click", (e) => {
            loadCart();
          });
        });
        $(`#${data.petmedicine._id}`).each((i, ele) => {
          ele.addEventListener("click", (e) => {
            $(`#desc-cart`).show();
            $(`#${data.petmedicine._id}`).hide();

            const index = getItemIndex(cart.petmedicine, e.target.id);
            if (index != -1) cart.petmedicine[index].quantity += 1;
            else
              cart.petmedicine.push({
                id: e.target.id,
                quantity: 1,
              });

            localStorage.setItem("cart", JSON.stringify(cart));
          });
        });
      });
  });
};

const loadPlaceOrder = () => {
  loadSnippet("/placeorder").then((res) => {
    let cartHtml = $("#cart-table").clone().html();
    utils.insertHtml("#main-content", res);
    utils.insertHtml("#cart-table", cartHtml);
    utils.onclickEvent("#btn-ordernow", async () => {
      await placeOrder();
      loadOrder();
    });
  });
};

const placeOrder = async () => {
  let order = {
    orderItems: [],
    itemsPrice: 0,
  };
  order.shippingInfo = {
    address: $("#address").val(),
    city: $("#city").val(),
    state: $("#state").val(),
    country: $("#country").val(),
    pinCode: parseInt($("#pincode").val()),
    phoneNo: parseInt($("#phone").val()),
  };
  order.paymentInfo = {
    id: s4() + "-" + s4(),
    status: $("input:checked", "#payment").val(),
  };
  for (let key of Object.keys(cart)) {
    for (let element of cart[key]) {
      let prod = {};
      prod[key] = element.id;
      order.orderItems.push({
        product: prod,
        quantity: element.quantity,
      });

      let res = await getServiceById(key, element.id);
      order.itemsPrice += res[key].price;
    }
  }
  order.taxPrice = (order.itemsPrice * 18) / 100;
  order.shippingPrice = 50 + (order.itemsPrice * 2) / 100;
  order.totalPrice = order.itemsPrice + order.taxPrice + order.shippingPrice;
  await loadData("/order/new", order);
  localStorage.removeItem("cart");
  resetCart();
};

const loadOrder = async () => {
  let orderPage = await loadSnippet("/myorder");
  let snippet = `<tr>
        <td>{{#}}</td>
        <td>{{item}}</td>
        <td>{{address}}</td>
        <td>{{amount}}</td>
        </tr>`,
    html,
    item,
    i = 1;

  let data = await fetch(utils.apiurl + "/orders/me", {
    credentials: "include",
  }).then((data) => data.json());
  utils.insertHtml("#main-content", orderPage);
  // utils.insertHtml('#order-desc', JSON.stringify(data));

  for (let [i, order] of data.orders.entries()) {
    html = utils.insertProperty(snippet, "#", i + 1);
    item = `<ol>`;
    for (let orderItem of order.orderItems) {
      let key = Object.keys(orderItem.product)[0];
      let row = await getServiceById("/" + key, orderItem.product[key]);
      if (key == "petfood")
        item += `<li>${row[key].foodname} ${row[key].brand}</li>`;
      else if (key == "petmedicine")
        item += `<li>${row[key].medname} ${row[key].brand}</li>`;
      else if (key == "pettoy")
        item += `<li>${row[key].Toyname} ${row[key].brand}</li>`;
      else if (key == "pet")
        item += `<li>${row[key].breed} ${row[key].petClass}</li>`;
    }
    item += `</ol>`;
    html = utils.insertProperty(html, "item", item);
    html = utils.insertProperty(
      html,
      "address",
      `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}<br /> Phone: ${order.shippingInfo.phoneNo}`
    );
    html = utils.insertProperty(html, "amount", order.totalPrice);
    utils.appendHtml("#order-table", html);
  }
};

const getItemIndex = (arr, id) => {
  let index = -1;
  arr.every((element, i) => {
    if (element.id == id) {
      index = i;
      return false;
    }
    return true;
  });
  return index;
};

const loadCart = () => {
  loadSnippet("/cart").then((res) => {
    let snippet = `<tr>
						<td>{{name}}</td>
						<td>{{brand}}</td>
						<td>{{quantity}}</td>
						</tr>`,
      html; // add/remove item in cart
    utils.insertHtml("#main-content", res);
    Object.keys(cart).forEach((key, index) => {
      cart[key].forEach((element, index) => {
        getServiceById(key, element.id).then((res) => {
          if (key == "petfood") {
            html = utils.insertProperty(snippet, "name", res[key].foodname);
            html = utils.insertProperty(html, "brand", res[key].brand);
          } else if (key == "petmedicine") {
            html = utils.insertProperty(
              snippet,
              "name",
              res["petmedicine"].medname
            );
            html = utils.insertProperty(
              html,
              "brand",
              res["petmedicine"].brand
            );
          } else if (key == "pettoy") {
            html = utils.insertProperty(snippet, "name", res[key].Toyname);
            html = utils.insertProperty(html, "brand", res[key].brand);
          } else if (key == "pet") {
            html = utils.insertProperty(snippet, "name", res[key].breed);
            html = utils.insertProperty(html, "brand", res[key].petClass);
          }
          html = utils.insertProperty(html, "quantity", element.quantity);
          utils.appendHtml("#cart-table", html);
        });
      });
    });
    utils.onclickEvent("#btn-placeorder", loadPlaceOrder);
  });
};

const getServiceById = (route, id) => {
  return fetch(`${utils.apiurl}/${route}/${id}`).then((data) => data.json());
};

const loadData = (route, data) => {
  return fetch(utils.apiurl + route, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((data) => data.json());
};

const loadSnippet = (route) => {
  return fetch(route, {
    method: "GET",
  }).then((res) => res.text());
};

const logout = () => {
  fetch(utils.apiurl + "/logout", {
    method: "GET",
    credentials: "include",
  }).then((res) => (window.location.href = "/"));
};

const resetCart = () => {
  cart = {
    pet: [],
    petfood: [],
    pettoy: [],
    petmedicine: [],
  };
  if (localStorage.getItem("cart"))
    cart = JSON.parse(localStorage.getItem("cart"));
};

$(() => {
  utils.onclickEvent("#s1", loadPetFood);
  utils.onclickEvent("#s2", loadPetmed);
  utils.onclickEvent("#s3", loadPetToy);
  utils.onclickEvent("#s4", loadPets);
  resetCart();
  utils.onclickEvent("#btn-dropdown", () => $("#dropdown").toggle());
  utils.onclickEvent("#cart", loadCart);
  utils.onclickEvent(
    "#dashboard",
    () => (window.location.href = "/dashboard.html")
  );
  utils.onclickEvent("#myorder", loadOrder);
  utils.onclickEvent("#profile", loadupdateprofile);
  utils.onclickEvent("#logout", logout);
});

const updateprofile = (res) => {
  const data = {
    foodname: $("#name").val(),
    email: $("#email").val(),
    phonenumber: parseInt($("#phonenumber").val()),
  };
 
  fetch(utils.apiurl + "/me/update", {
    method: "PUT",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
   
      loadSnippet("/service/me").then((res) => {
        utils.insertHtml("#main-content", res);
      });
    });
};

const loadupdateprofile = (e) => {
  loadSnippet("service/me").then((res) => {
    utils.insertHtml("#main-content", res);
    fetch(utils.apiurl + "/me", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      var html;
      html = utils.insertProperty(res, "id", user.id);
      html = utils.insertProperty(html, "name", user.name);
      html = utils.insertProperty(html, "phone", user.phonenumber);
      // show image
    });

    $("#btn-create").html("Update");
    $("#btn-create").attr("value", e.target.value);
    utils.onclickEvent("#btn-create", updateprofile);
  });
};

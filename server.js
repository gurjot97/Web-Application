/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy. No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Gurjot Saini       Student ID: 035 053 156         Date: 15/07/19
*
*  Online (Heroku) Link: https://obscure-atoll-94637.herokuapp.com/ 
*
********************************************************************************/ 

//declaring variables for using various modules
var express = require("express");
var app = express();
var path = require("path");

//importing data-service module
var dataService = require("./data-service.js");

//importing multer module
var multer = require("multer");

//importing fs module
var fs = require("fs");

//importing body-parser module
var bodyParser = require("body-parser");

//importing express-handlebars module
var exphbs = require('express-handlebars');

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

//to work correctly access resource
app.use(express.static('public')); 

//adding body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// multer requires a few options to be setup to store files with file extensions
const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

//adding specific parameters to the app object's engine method
app.engine('.hbs', exphbs({ 
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    navLink: function(url, options){
      return '<li' + 
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
          return options.inverse(this);
      } else {
          return options.fn(this);
      }
    }
  }
}));

//to specify the 'view engine' 
app.set('view engine', '.hbs');

//This will add the property "activeRoute" to "app.locals" whenever the route changes
app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
});

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
  res.render('home');
});

// setup another route to listen on /about
app.get("/about", function(req,res){
  res.render('about');
});

// setup another route to listen on /employees
app.get("/employees", function(req,res) {

  if(req.query.status) {
    dataService.getEmployeesByStatus(req.query.status)
    .then( (data) => {
      if(data.length > 0) {
        res.render("employees", {employees: data});
      }
      else {
        res.render("employees",{ message: "no results" });
      }
    })
    .catch((errMsg) => {
      res.render("employees",{ message: "no results" });
    });
  }
  else if(req.query.department) {
    dataService.getEmployeesByDepartment(req.query.department)
    .then( (data) => {
      if(data.length > 0) {
        res.render("employees", {employees: data});
      }
      else {
        res.render("employees",{ message: "no results" });
      }
    })
    .catch((errMsg) => {
      res.render("employees",{ message: "no results" });
    });
  }
  else if(req.query.manager) {
    dataService.getEmployeesByManager(req.query.manager)
    .then( (data) => {
      if(data.length > 0) {
        res.render("employees", {employees: data});
      }
      else {
        res.render("employees",{ message: "no results" });
      }
    })
    .catch((errMsg) => {
      res.render("employees",{ message: "no results" });
    });
  }
  else {
      dataService.getAllEmployees()
    .then( (data) => {
      if(data.length > 0) {
        res.render("employees", {employees: data});
      }
      else {
        res.render("employees",{ message: "no results" });
      }
    })
    .catch( (errMsg) => {
      res.render("employees",{ message: "no results" });
    });
  }
});

// setup another route to listen on /employee/#

/*** DELETED ***
app.get("/employee/:num", function(req,res) { 
  
  dataService.getEmployeeByNum(req.params.num)
  .then( (data) => {
    res.render("employee", {employee:data}); 
  })
  .catch((errMsg) => {
    res.render("employee",{message:"no results"}); 
  });
});
*/

app.get("/employee/:empNum", (req, res) => {

  // initialize an empty object to store the values
  let viewData = {};

  dataService.getEmployeeByNum(req.params.empNum).then((data) => {
      if (data) {
          viewData.employee = data; //store employee data in the "viewData" object as "employee"
      } else {
          viewData.employee = null; // set employee to null if none were returned
      }
  }).catch(() => {
      viewData.employee = null; // set employee to null if there was an error 
  }).then(dataService.getDepartments)
  .then((data) => {
      viewData.departments = data; // store department data in the "viewData" object as "departments"

      // loop through viewData.departments and once we have found the departmentId that matches
      // the employee's "department" value, add a "selected" property to the matching 
      // viewData.departments object

      for (let i = 0; i < viewData.departments.length; i++) {
          if (viewData.departments[i].departmentId == viewData.employee.department) {
              viewData.departments[i].selected = true;
          }
      }

  }).catch(() => {
      viewData.departments = []; // set departments to empty if there was an error
      res.status(500).send("Unable to get Employee");
  }).then(() => {
      if (viewData.employee == null) { // if no employee - return an error
          res.status(404).send("Employee Not Found");
      } else {
          res.render("employee", { viewData: viewData }); // render the "employee" view
      }
  });
});


// setup another route to listen on /managers   *Not being used*
/*
app.get("/managers", function(req,res) {
  
  dataService.getManagers()
  .then( (managers) => {
    res.json(managers);
  })
  .catch( (errMsg) => {
    res.json( {message: errMsg} );
  });
});
*/

// setup another route to listen on /departments
app.get("/departments", function(req,res) {
  dataService.getDepartments()
  .then( (data) => {
    if(data.length > 0) {
      res.render("departments", {departments: data});
    }
    else {
      res.render("departments", {message: "no results"});
    }
  })
  .catch( (errMsg) => {
    res.render("departments", {message: "no results"});
  });
});

// setup another route to listen on /employees/add
app.get("/employees/add", (req, res) => {
  
  dataService.getDepartments()
  .then( (data) => {
    res.render("addEmployee", {departments: data});
  })
  .catch( () => {
    res.render("addEmployee", {departments: []}); 
  });

  
});

// setup another route to listen on /images/add
app.get("/images/add", (req, res) => {
  res.render('addImage');
});

// setup another route to listen on /images/add from a form
app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

// setup another route to listen on /images
app.get("/images", (req, res) => {
  
  var img = { 
    "images": [] 
  };

  fs.readdir("./public/images/uploaded", function(err, items) {
  
    if (err) throw err;
    res.render("images", { "images" : items}); 
  }); 
});

// setup another route to listen on /images/add from a form
app.post("/employees/add", (req, res) => {
  
  dataService.addEmployee(req.body)
  .then( () => {
    res.redirect("/employees");
  })
  .catch( () => {
    res.status(500).send("unable to add employee");
  });
});

// setup another route to listen on /employee/update from a form
app.post("/employee/update", (req, res) => {
  //console.log(req.body);

  dataService.updateEmployee(req.body)
  .then( () => {
    res.redirect("/employees");
  })
  .catch((err) => {
    //res.render({message: err});
    res.status(500).send("Unable to Update Employee");
  }); 
});

//setup another route to listen on /departments/add
app.get("/departments/add", (req, res) => {
  res.render('addDepartment');
});

// setup another route to listen on /departments/add from a form
app.post("/departments/add", (req, res) => {
  dataService.addDepartment(req.body)
  .then( () => {
    res.redirect("/departments");
  })
  .catch( (err) => {
    res.render({message: err});
  });
});

// setup another route to listen on /department/update from a form
app.post("/department/update", (req, res) => {
  dataService.updateDepartment(req.body)
  .then( () => {
    res.redirect("/departments");
  })
  .catch( (err) => {
    //res.render({message: err});
    res.status(500).send("Unable to update department");
  });
});

// setup another route to listen on /department/:#
app.get("/department/:departmentId", function(req,res) { 
  
  dataService.getDepartmentById(req.params.departmentId)
  .then( (data) => {
    
    if(data === undefined) {
      res.status(404).send("Department Not Found");
    }
    else {
      res.render("department", {department: data}); 
    }
  })
  .catch((errMsg) => {
    res.render("department",{message:"no results"}); 
  });
});

// setup another route to listen on "/employees/delete/:#
app.get("/employees/delete/:empNum", (req, res) => {

  dataService.deleteEmployeeByNum(req.params.empNum)
  .then( () => {
    res.redirect("/employees");
  })
  .catch( () => {
    res.status(500).send("Unable to Remove Employee / Employee not found)");
  });
});

//sends a 404 page route 
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname,"./views/pageNotFound.html"));
});

//checking if the data is available
dataService.initialize()
.then( () => { 
  // setup http server to listen on HTTP_PORT
  app.listen(HTTP_PORT, onHttpStart);
})
.catch( (errMsg) => {
  console.log(errMsg);
});

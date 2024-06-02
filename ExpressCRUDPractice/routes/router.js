const express=require("express");
const router=express.Router();

const connection= require("../db/dbconnection")

router.get("/login",function(req, resp){
    resp.render("login");
})

router.get("/register", function(req, resp){
    resp.render("registration.ejs")
})

router.post("/register-user",function(req, resp){
    var name = req.body.uname;
    var user = req.body.user;
    var pass = req.body.pass;
    connection.query("insert into Customer(Name, UserName, Password) values(?, ?, ?)",[name, user, pass], function(err, result, fields){
        if(err){
            resp.status(500).send("Error Occured")
        }else{
            if(result.affectedRows > 0){
                resp.send("<center><h1>Registration successfull</h1><a href='login'>Go To Login Page</a></center>")
            }else{
                resp.send("<center><h1>Registration Unsuccessfull</h1><a href='register'>Go To Registration Page</a></center>")
            }
        }
    })
})

router.post("/validate-user",function(req,resp){
    var uname=req.body.uname;
    var pass=req.body.pass;
    console.log(uname+" "+pass);
    connection.query("select * from Customer where UserName=? and Password=?",[uname, pass],function(err, result, fields){
        if(err){
            resp.status(500).send("Error Occured")
        }else{
            if(result.length > 0){
                req.session.loggedin = true;
                req.session.uname = req.body.uname;
                req.session.name = result[0].Name;
                req.session.userid = result[0].Id;
                console.log(result[0].Id+" "+req.session.userid)

                resp.render("index",{prodarr:result})
                // resp.send("Login successfull")
                // resp.end()
            }
            else{
                resp.send("<h1>Login Unsuccessfull</h1><a href='login'>Go To Login Page</a>")
            }
        }
    })
})



router.get("/showData", function(req, resp){
    if(req.session.loggedin){   
        var id = req.session.userid
        console.log(req.session.userid+" "+req.session.name)
        connection.query("select * from Customer as a join Products as b on a.Id = b.Cid where a.Id=?",[id],function(err, result, fields){
            if(err){
                resp.status(500).send("Error Occured")
            }else{
                if(result.length>0){
                    resp.render("data",{prodarr:result})
                }
                else{
                    resp.send("<center><h1>There are no products in your cart !!</h1><h3>You can add new products or logout</h3><a href='addproduct'><button type='button' name='btn' id='btn' value='add'>Add Product</a><a href='logout'><button type='button' name='btn' id='btn' value='logout'>Logout</a></center>")
                }
            }
        })
    }else{
        resp.send("<center><h1>Session time out </h1><a href='login'>Go To Login Page</a></center>")
    }

})

router.get("/addproduct", function(req, resp){
    if(req.session.loggedin){
        var val = req.session.name;
        resp.render("addProducts",{user:val})
    }
    else{
        resp.send("Session time out <br> <a href='login'>Go To Login Page</a>")
    }
})

router.post("/addingProducts",function(req, resp){
    var pname = req.body.pname;
    var quantity = req.body.quantity;
    var cid = req.session.userid;
    connection.query("insert into Products (Pname, Quantity, Cid) values (?, ? ,?)",[pname, quantity, cid], function(err, result, fields){
        if(err){
            resp.status(500).send("Error Occured")
        }else{
            if(result.affectedRows > 0){
                resp.redirect("/showData")
            }
            else{
                resp.send("Product not added <br> <a href='addingProducts'>Go Back</a>")
            }
        }
    })
})

router.get("/editproduct/:prodid",function(req, resp){
    req.session.prodid = req.params.prodid;
    var val = req.session
    resp.render("")
})

router.get("/deleteproduct/:prodid",function(req, resp){
    var pid = req.params.prodid;
    connection.query("delete from Products where Pid=? and  Cid=?",[pid, req.session.userid], function(err, result, fields){
        if(err){
            resp.status(500).send("Error Occured")
        }
        else{
            if(result.affectedRows > 0){
                resp.redirect("/showData")
            }
            else{
                resp.status(404).send("Product Not Found")
            }
        }
    })

})

router.get("/logout",function(req,resp){
    req.session.destroy(function(err){
        resp.redirect("/login")
    })
})


module.exports=router;
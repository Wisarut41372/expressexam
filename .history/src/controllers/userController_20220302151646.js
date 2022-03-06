const User = require("../models/userModel");

exports.getUsers = async (req, res) => {

    User.find()
        .exec((err, result) => {
            res.status(200).json({
                msg: "Success",
                data: result
            });
        });
};

exports.register = async (req, res)=> {
    try {

        let user = new User({
            username: req.body.username,
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            status: req.body.status
        })
        user.password = await user.hashPassword(req.body.password);

        let createdUser = await user.save();
        res.status(200).json({
            msg: "New user created",
            data: createdUser
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
};

exports.login = async (req, res) => {
    const login = {
        email: req.body.email,
        password: req.body.password
    }
    // console.log(login)
    try {
        let user = await User.findOne({
            email: login.email
        });
        // console.log(user);
        //check if user exit
        if (!user) {
            res.status(400).json({
                type: "Not Found",
                msg: "Wrong Login Details"
            })
        }else{
            let match = await user.compareUserPassword(login.password, user.password);
        if (match) {
            let token = await user.generateJwtToken({
                user
            }, "secret", {
                expiresIn: 604800
            })

            if (token) {
                res.status(200).json({
                    success: true,
                    token: token,
                    //status: status
                    userCredentials: user
                })
            }
        } else {
            res.status(400).json({
                type: "Not Found",
                msg: "Wrong Login Details"
            })
        }
        }

        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            type: "Something Went Wrong",
            msg: err
        })
    }

    exports.deleteuser = async (req, res) => {
        User.findByIdAndDelete(req.params.id)        
            .exec((err)=>{
                if(err){
                    res.status(500).json({
                        msg: err
                    });
                } else{
                    res.status(200).json({
                        msg: "ลบเรียบร้อยแล้ว"
                    });
                }
            });
    };
};
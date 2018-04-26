const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done)=>{
   done(null,user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user)=>{
         done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},(req,email,password,done)=>{
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid passwword').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    if(errors){
        var messages=[];
        errors.forEach((error)=>{
            messages.push(error.msg);
        });
        return done(null,false, req.flash('error', messages))
    }
    User.findOne({'email':email}, (err, user)=>{
        if(err){
            return done(err);
        }
        if(user){
            return done(null,false,{message:"Authentication Failed"});
        }
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save()
            .then(res=>{
                done(null, newUser);
            })
            .catch(err=>{
                done(err);
            })
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},(req,email,password,done)=>{
}));

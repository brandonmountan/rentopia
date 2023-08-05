const router = require('express').Router();
const { Item, User } = require('../models');
const withAuth = require('../utils/auth');
const imagesData = require('../models/imagesData');
// const profileData = require('../models/profileData');

router.get('/', async (req, res) => {
  try {
    // Get all items and JOIN with user data
    const itemData = await Item.findAll({
      include: [
        {
          model: User,
        },
      ],
    });

    // Serialize data so the template can read it
    const items = itemData.map((item) => item.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      items, 
      imagesData,
      // profileData,
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/item', async (req, res) => {
  try {
    // Get all items and JOIN with user data
    const itemData = await Item.findAll({
      include: [
        {
          model: User,
        },
      ],
    });

    // Serialize data so the template can read it
    const items = itemData.map((item) => item.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('item', { 
      items, 
      imagesData,
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/item/:id', async (req, res) => {
  try {
    const itemData = await Item.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
      ],
    });

    const item = itemData.get({ plain: true });

    res.render('item', {
      ...item,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
// NEED PROFILE HANDLEBARS
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Item }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  
  res.render('login');

});

router.get('/sign-up', async (req, res) => {
  res.render('sign-up');
});


// router.post('/logout', (req, res) => {
//   if (req.session.logged_in) {
//     req.session.destroy(() => {
//       res.status(204).end();
//     });
//   } else {
//     res.status(404).end();
//   }
// });


module.exports = router;

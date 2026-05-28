const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllArticles,
  deleteAnyArticle,
  approveArticle,
  getAllPlaces,
  createPlace,
  updatePlace,
  deletePlace,
  getAllChats,
  getSiteConfig,
  updateSiteConfig
} = require('../controllers/adminController');

// All admin routes should be protected and restricted to admin
router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);

router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .get(getUserById)
  .delete(deleteUser);

router.put('/users/:id/role', updateUserRole);

router.route('/articles')
  .get(getAllArticles);

router.route('/articles/:id')
  .delete(deleteAnyArticle);

router.put('/articles/:id/approve', approveArticle);

router.route('/places')
  .get(getAllPlaces)
  .post(createPlace);

router.route('/places/:id')
  .put(updatePlace)
  .delete(deletePlace);

router.get('/chats', getAllChats);

router.route('/site-config')
  .get(getSiteConfig)
  .put(updateSiteConfig);

module.exports = router;

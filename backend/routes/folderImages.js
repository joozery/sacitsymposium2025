const express = require('express');
const FolderImagesController = require('../controllers/folderImagesController');

const router = express.Router();

/**
 * @route GET /api/folders/:folderId/images
 * @desc Get all images for a specific folder
 * @param {number} folderId - Folder ID
 */
router.get('/:folderId/images', FolderImagesController.getFolderImages);

/**
 * @route POST /api/folders/:folderId/images
 * @desc Add single image to folder
 * @param {number} folderId - Folder ID
 * @body {string} name - Image name (required)
 * @body {string} subtitle - Image subtitle
 * @body {string} description - Image description
 * @body {string} image_url - Image URL (required)
 * @body {string} thumbnail_url - Thumbnail URL
 * @body {string} file_key - S3 file key
 * @body {number} file_size - File size in bytes
 * @body {string} file_type - File MIME type
 * @body {array} keywords - Keywords array
 */
router.post('/:folderId/images', FolderImagesController.addImageToFolder);

/**
 * @route POST /api/folders/:folderId/images/batch
 * @desc Batch add multiple images to folder
 * @param {number} folderId - Folder ID
 * @body {array} images - Array of image objects to add
 */
router.post('/:folderId/images/batch', FolderImagesController.batchAddImagesToFolder);

/**
 * @route DELETE /api/folders/:folderId/images/:imageId
 * @desc Delete image from folder
 * @param {number} folderId - Folder ID
 * @param {number} imageId - Image ID
 */
router.delete('/:folderId/images/:imageId', FolderImagesController.deleteImageFromFolder);

/**
 * @route POST /api/folders/migrate
 * @desc Migrate images from media table to folder_images table
 */
router.post('/migrate', FolderImagesController.migrateFromMediaTable);

module.exports = router;
const express = require('express');
const router = express.Router();
const { Categories } = require('../db/db');

router.get('/', async (req, res) => {
    const categories = await Categories.findAll();
    const transformedCategories = categories.map(category => {
        return {
            id: category.id,
            name: category.name,
        };
    });
    res.json(transformedCategories);
});

router.get('/:id', async (req, res) => {
    const category = await Categories.findByPk(req.params.id);
    if (!category) {
        res.status(404).send('Category not found');
    } else {
        res.json(category);
    }
});

router.post('/', async (req, res) => {
    const {name} = req.body;
    if (!name) {
        return res.status(400).send('Name is required');
    }
    if ((await Categories.findOne({where: {name}})) !== null) {
        return res.status(409).send('Category already exists');
    }

    const category = await Categories.create(req.body);
    res.status(201).json(category);
});

module.exports = router;
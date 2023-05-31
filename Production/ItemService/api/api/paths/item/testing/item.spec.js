const ItemService = require('./ItemService');
const ItemRepository = require('../repositories/ItemRepository');
const Joi = require('joi');

// Mock the ItemRepository
jest.mock('../repositories/ItemRepository');

describe('ItemService', () => {
    let itemService;
    let mockItemData;

    beforeEach(() => {
        // Create a new instance of the service for each test
        itemService = new ItemService();

        mockItemData = {
            name: "TestItem",
            description: "This is a test item"
        };

        // Clear all mock calls before each test
        ItemRepository.mockClear();
    });

    test('getAllItem calls repository', async () => {
        await itemService.getAllItems();
        expect(ItemRepository.prototype.getAllItems).toHaveBeenCalledTimes(1);
    });

    test('getItemById calls repository with correct id', async () => {
        const id = 'test-id';
        await itemService.getItemById(id);
        expect(ItemRepository.prototype.getItemById).toHaveBeenCalledWith(id);
    });

    test('createItem validates input and calls repository', async () => {
        await itemService.createItem(mockItemData);
        expect(ItemRepository.prototype.createItem).toHaveBeenCalledWith(mockItemData);
    });

    test('createItem throws an error if input is invalid', async () => {
        
        const invalidItemData = {...mockItemData, name: undefined};

        await expect(itemService.createItem(invalidItemData)).rejects.toThrow(Joi.ValidationError);
    });

    // Similarly, you can add tests for updateItem and deleteItem
});
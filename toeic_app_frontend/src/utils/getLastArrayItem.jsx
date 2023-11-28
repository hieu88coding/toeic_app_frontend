export const getArrayLastItem = (array) => {
    return array[array.length - 1];
};

export const getIndexOfItem = (arr, id) => {
    return arr.findIndex((item) => item.id === id);
};

export const removeItemByIndex = (arr, indexToRemove) => {
    // Check if the index is valid
    if (indexToRemove < 0 || indexToRemove >= arr.length) {
        return arr.slice(); // Return a shallow copy of the original array
    }

    // Create a new array without the specified element
    const newArr = [
        ...arr.slice(0, indexToRemove),
        ...arr.slice(indexToRemove + 1),
    ];
    return newArr;
};

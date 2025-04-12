const CART_SORTED_ALPHABETICALLY = [
  {
    id: 3,
    article: {
      id: 1,
      name: "HH first article",
    },
    category: {
      id: 3,
      name: "alpha",
    },
    quantity: 1,
    checked: false,
    sorted: true,
  },
  {
    id: 2,
    article: {
      id: 4,
      name: "XX fourth article",
    },
    category: {
      id: 2,
      name: "gamma",
    },
    quantity: 1,
    checked: false,
    sorted: true,
  },
  {
    id: 1,
    article: {
      id: 3,
      name: "ZZ third article",
    },
    category: {
      id: 1,
      name: "beta",
    },
    quantity: 2,
    checked: true,
    sorted: true,
  },
];

const CART_SORTED_BY_SHOP = [
  {
    id: 2,
    article: {
      id: 4,
      name: "XX fourth article",
    },
    category: {
      id: 2,
      name: "gamma",
    },
    quantity: 1,
    checked: false,
    sorted: true,
  },
  {
    id: 1,
    article: {
      id: 3,
      name: "ZZ third article",
    },
    category: {
      id: 1,
      name: "beta",
    },
    quantity: 2,
    checked: true,
    sorted: true,
  },
  {
    id: 3,
    article: {
      id: 1,
      name: "HH first article",
    },
    category: {
      id: 3,
      name: "alpha",
    },
    quantity: 1,
    checked: false,
    sorted: true,
  },
];

const CART_WITH_SOME_NOT_SORTED = [
  {
    id: 1,
    article: {
      id: 3,
      name: "ZZ third article",
    },
    category: {
      id: 1,
      name: "beta",
    },
    quantity: 2,
    checked: true,
    sorted: false,
  },
  {
    id: 3,
    article: {
      id: 1,
      name: "HH first article",
    },
    category: {
      id: 3,
      name: "alpha",
    },
    quantity: 1,
    checked: false,
    sorted: true,
  },
  {
    id: 2,
    article: {
      id: 4,
      name: "XX fourth article",
    },
    category: {
      id: 2,
      name: "gamma",
    },
    quantity: 1,
    checked: false,
    sorted: true,
  },
];

const CART_WITH_NONE_SORTED = [
  {
    id: 3,
    article: {
      id: 1,
      name: "HH first article",
    },
    category: {
      id: 3,
      name: "alpha",
    },
    quantity: 1,
    checked: false,
    sorted: false,
  },
  {
    id: 2,
    article: {
      id: 4,
      name: "XX fourth article",
    },
    category: {
      id: 2,
      name: "gamma",
    },
    quantity: 1,
    checked: false,
    sorted: false,
  },
  {
    id: 1,
    article: {
      id: 3,
      name: "ZZ third article",
    },
    category: {
      id: 1,
      name: "beta",
    },
    quantity: 2,
    checked: true,
    sorted: false,
  },
];

const CART_ONLY_CHECKED = [
  {
    id: 1,
    article: {
      id: 3,
      name: "ZZ third article",
    },
    category: {
      id: 1,
      name: "beta",
    },
    quantity: 2,
    checked: true,
    sorted: true,
  },
];

const CART_ONLY_UNCHECKED = [
  {
    id: 2,
    article: {
      id: 4,
      name: "XX fourth article",
    },
    category: {
      id: 2,
      name: "gamma",
    },
    quantity: 1,
    checked: false,
    sorted: true,
  },
  {
    id: 3,
    article: {
      id: 1,
      name: "HH first article",
    },
    category: {
      id: 3,
      name: "alpha",
    },
    quantity: 1,
    checked: false,
    sorted: true,
  },
];

module.exports = {
  CART_SORTED_ALPHABETICALLY,
  CART_SORTED_BY_SHOP,
  CART_WITH_SOME_NOT_SORTED,
  CART_ONLY_CHECKED,
  CART_ONLY_UNCHECKED,
  CART_WITH_NONE_SORTED,
};

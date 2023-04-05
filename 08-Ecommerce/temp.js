[
  {
    $match: {
      product: ObjectId("642d7eb32ed8e2e7574bcd69"),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];

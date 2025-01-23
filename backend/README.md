// ...existing code...

## Create a New Category

To create a new category, you can use the following curl command:

```sh
curl -X POST http://localhost:5000/api/categories/add \
     -H "Content-Type: application/json" \
     -d '{
           "name": "New Category",
           "parent": "60d21b4667d0d8992e610c85", // Optional: Parent category ID
           "icon": "icon-path.png" // Optional: Icon path or name
         }'
```

Replace `http://localhost:5000` with your actual backend URL if different.

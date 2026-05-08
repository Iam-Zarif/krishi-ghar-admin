const apiList = [
  // Frontend developer notes:
  // - Use Authorization: Bearer <token> for protected endpoints.
  // - Check each endpoint response shape; some return nested data, others return top-level fields.
  // - For multipart uploads, the file field is usually image; producer category icon upload uses icon.
  // - Chat REST endpoints are the reliable source of truth; full realtime chat socket events are not active.
  // - Admin chat send may fail until backend maps notification priority "important" to a valid enum value.
  // - Hide/comment admin UI controls that do not have a matching endpoint in this list.
  // ==================== AUTHENTICATION ====================
  {
    
    method: "POST",
    url: "/api/v1/register",
    body: { name: "string",
            email: "string",
            password: "string",
            phone: "string",
            address: "string",
            userType: "string"
          },

    response: { success: "boolean",
                message: "string",
                user: "object",
                token: "string"
              }
  },

  {
   
    method: "POST",
    url: "/api/v1/register/consumer",
    body: { name: "string",
            email: "string",
            password: "string",
            phone: "string",
            address: "string"
          },
    response: { success: "boolean",
                message: "string",
                consumer: "object",
                token: "string"
              }
  },

  {
  
    method: "POST",
    url: "/api/v1/login",
    body: { email: "string",
            password: "string"
          },
    response: { success: "boolean",
                message: "string",
                user: "object",
                token: "string"
              }
  },

  {
   
    method: "POST",
    url: "/api/v1/logout",
    body: { userId: "ObjectId"
          },
    response: { success: "boolean",
                message: "string"
              }
  },

  // ==================== PROFILE ====================
  {
    method: "GET",
    url: "/api/v1/profile",
    response: { success: "boolean",
                message: "string",
                user: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/profile",
    body: { image: "File (multipart/form-data, optional)",
            fields: "profile fields as text fields"
          },
    response: { success: "boolean",
                message: "string",
                user: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/profile/image",
    body: { image: "File (multipart/form-data)"
          },
    response: { success: "boolean",
                message: "string",
                user: "object"
              }
  },

  // ==================== CART ====================
  {
   
    method: "POST",
    url: "/api/v1/addToCart/add",
    body: { productId: "ObjectId",
            quantity: "number",
            price: "number"
          },
    response: { success: "boolean",
                message: "string",
                cart: "object"
              }
  },

  {
    
    method: "GET",
    url: "/api/v1/addToCart/",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                cart: "object",
                pagination: "object"
              }
  },

  {
    
    method: "DELETE",
    url: "/api/v1/addToCart/remove/:productId",
    response: { success: "boolean",
                message: "string",
                cart: "object"
              }
  },

  {
    
    method: "PUT",
    url: "/api/v1/addToCart/update",
    body: { productId: "ObjectId",
            quantity: "number"
          },
    response: { success: "boolean",
                message: "string",
                cart: "object"
              }
  },

  // ==================== ORDERS ====================
  {
   
    method: "POST",
    url: "/api/v1/order/create",
    body: { userId: "ObjectId",
            products: "array",
            shippingAddress: "string",
            paymentMethod: "string",
            totalAmount: "number"
          },
    response: { success: "boolean",
                message: "string",
                order: "object"
              }
  },

  {
  
    method: "GET",
    url: "/api/v1/order/",
    query: { page: "number (optional)",
             limit: "number (optional)",
             status: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                orders: "array",
                pagination: "object"
              }
  },

  {
    
    method: "GET",
    url: "/api/v1/order/stats",
    query: { userId: "ObjectId (optional)",
             startDate: "string (optional)",
             endDate: "string (optional)"
           },
    response: { success: "boolean",
                totalOrders: "number",
                totalRevenue: "number",
                averageOrderValue: "number",
                completedOrders: "number",
                pendingOrders: "number",
                cancelledOrders: "number"
              }
  },

  {
   
    method: "GET",
    url: "/api/v1/order/recent",
    query: { limit: "number (optional, default: 10)"
           },
    response: { success: "boolean",
                message: "string",
                orders: "array"
              }
  },

  {
   
    method: "GET",
    url: "/api/v1/order/:orderId",
    response: { success: "boolean",
                message: "string",
                order: "object"
              }
  },

  {
    
    method: "PUT",
    url: "/api/v1/order/:orderId/cancel",
    body: { reason: "string"
          },
    response: { success: "boolean",
                message: "string",
                order: "object"
              }
  },

  // ==================== PAYMENTS ====================
  {
   
    method: "POST",
    url: "/api/v1/payments/initiate-cod",
    body: { orderId: "ObjectId",
            amount: "number",
            paymentMethod: "cod"
          },
    response: { success: "boolean",
                message: "string",
                payment: "object"
              }
  },

  {
   
    method: "GET",
    url: "/api/v1/payments/",
    query: { page: "number (optional)",
             limit: "number (optional)",
             status: "string (optional)",
             userId: "ObjectId (optional)"
           },
    response: { success: "boolean",
                message: "string",
                payments: "array",
                pagination: "object"
              }
  },

  {
    
    method: "GET",
    url: "/api/v1/payments/:paymentId",
    response: { success: "boolean",
                message: "string",
                payment: "object"
              }
  },

  {
 
    method: "PUT",
    url: "/api/v1/payments/:paymentId/status",
    body: { status: "string"
          },
    response: { success: "boolean",
                message: "string",
                payment: "object"
              }
  },

  // ==================== WISHLIST ====================
  {
  
    method: "POST",
    url: "/api/v1/wishlist/add",
    body: { productId: "ObjectId"
          },
    response: { success: "boolean",
                message: "string",
                wishlist: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/wishlist/",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                wishlist: "object",
                pagination: "object"
              }
  },

  {
    method: "DELETE",
    url: "/api/v1/wishlist/:wishlistId",
    response: { success: "boolean",
                message: "string"
              }
  },

  {
  
    method: "GET",
    url: "/api/v1/wishlist/check/:productId",
    response: { success: "boolean",
                message: "string",
                isInWishlist: "boolean"
              }
  },

  {
    method: "DELETE",
    url: "/api/v1/wishlist/",
    response: { success: "boolean",
                message: "string"
              }
  },

  // ==================== PRODUCTS ====================
  {
    method: "GET",
    url: "/api/v1/products/",
    query: { page: "number (optional)",
             limit: "number (optional)",
             category: "string (optional)",
             search: "string (optional)",
             sortBy: "string (optional)",
             order: "string (optional)",
             minPrice: "number (optional)",
             maxPrice: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                products: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/products/categories",
    response: { success: "boolean",
                message: "string",
                categories: "array"
              }
  },

  {
    method: "GET",
    url: "/api/v1/products/:productId",
    response: { success: "boolean",
                message: "string",
                product: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/products/by-producer/:producerId",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                products: "array",
                pagination: "object"
              }
  },

  // ==================== REVIEWS ====================
  {
    method: "POST",
    url: "/api/v1/reviews/create-review",
    body: { productId: "ObjectId",
            rating: "number",
            comment: "string",
            userId: "ObjectId"
          },
    response: { success: "boolean",
                message: "string",
                review: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/reviews/get-review/:productId",
    query: { page: "number (optional)",
             limit: "number (optional)",
             sortBy: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                reviews: "array",
                averageRating: "number",
                totalReviews: "number",
                pagination: "object"
              }
  },

  {
    
    method: "GET",
    url: "/api/v1/reviews/user-review/:userName",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                reviews: "array",
                pagination: "object"
              }
  },

  // ==================== FAQs ====================
  {
   
    method: "POST",
    url: "/api/v1/faq/create",
    body: { question: "string",
            answer: "string",
            category: "string",
            priority: "number"
          },
    response: { success: "boolean",
                message: "string",
                faq: "object"
              }
  },

  {
  
    method: "GET",
    url: "/api/v1/faq/",
    query: { page: "number (optional)",
             limit: "number (optional)",
             category: "string (optional)",
             search: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                faqs: "array",
                pagination: "object"
              }
  },

  // ==================== CHATS ====================
  {
    method: "POST",
    url: "/api/v1/chats/create",
    body: { subject: "string",
            priority: "string",
            category: "string",
            chatType: "string"
          },
    response: { success: "boolean",
                message: "string",
                chat: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/chats/user-chats",
    query: { page: "number (optional)",
             limit: "number (optional)",
             status: "string (optional)",
             category: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                data: {
                  chats: "array",
                  pagination: "object"
                }
              }
  },

  {
    method: "GET",
    url: "/api/v1/chats/messages/:chatId",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                data: {
                  messages: "array",
                  pagination: "object"
                }
              }
  },

  {
    method: "POST",
    url: "/api/v1/chats/send-message",
    body: { chatId: "ObjectId",
            content: "string",
            messageType: "string",
            replyTo: "ObjectId (optional)",
            mediaUrl: "string (optional)",
            mediaThumbnail: "string (optional)",
            mediaSize: "number (optional)",
            mediaDuration: "number (optional)",
            location: "object (optional)",
            fileName: "string (optional)",
            fileType: "string (optional)"
          },
    response: { success: "boolean",
                message: "string",
                data: "message object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/chats/messages/:messageId/edit",
    body: { content: "string"
          },
    response: { success: "boolean",
                message: "string",
                data: "message object"
              }
  },

  {
    method: "DELETE",
    url: "/api/v1/chats/messages/:messageId",
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "POST",
    url: "/api/v1/chats/messages/:messageId/reactions",
    body: { emoji: "string"
          },
    response: { success: "boolean",
                message: "string",
                data: "message object"
              }
  },

  {
    method: "DELETE",
    url: "/api/v1/chats/messages/:messageId/reactions",
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/chats/:chatId/close",
    response: { success: "boolean",
                message: "string",
                data: "chat object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/chats/admin-chats",
    query: { page: "number (optional)",
             limit: "number (optional)",
             status: "string (optional)",
             priority: "string (optional)",
             userType: "string (optional)",
             category: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                data: {
                  chats: "array",
                  pagination: "object"
                }
              }
  },

  {
    method: "PUT",
    url: "/api/v1/chats/:chatId/assign",
    response: { success: "boolean",
                message: "string",
                data: "chat object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/chats/:chatId/resolve",
    response: { success: "boolean",
                message: "string",
                data: "chat object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/chats/:chatId/escalate",
    body: { reason: "string"
          },
    response: { success: "boolean",
                message: "string",
                data: "chat object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/chats/:chatId/priority",
    body: { priority: "string"
          },
    response: { success: "boolean",
                message: "string",
                data: "chat object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/chats/:chatId/category",
    body: { category: "string"
          },
    response: { success: "boolean",
                message: "string",
                data: "chat object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/chats/stats",
    query: { userType: "string (optional)",
             status: "string (optional)",
             category: "string (optional)",
             startDate: "string (optional)",
             endDate: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                data: {
                  chats: "object",
                  messages: "object"
                }
              }
  },

  // ==================== DASHBOARDS ====================
  {
    method: "GET",
    url: "/api/v1/dashboard/consumer-dashboard",
    response: { success: "boolean",
                message: "string",
                dashboard: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/dashboard/wholesaler-dashboard",
    response: { success: "boolean",
                message: "string",
                dashboard: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/dashboard/supersaler-dashboard",
    response: { success: "boolean",
                message: "string",
                dashboard: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/dashboard/producer-dashboard",
    response: { success: "boolean",
                message: "string",
                dashboard: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/dashboard/admin-dashboard",
    response: { success: "boolean",
                message: "string",
                dashboard: "object"
              }
  },

  // ==================== CONSUMER ====================
  {
    method: "GET",
    url: "/api/v1/consumer/profile",
    response: { success: "boolean",
                message: "string",
                consumer: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/consumer/profile",
    body: { name: "string",
            phone: "string",
            address: "string"
          },
    response: { success: "boolean",
                message: "string",
                consumer: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/consumer/profile-image",
    body: { image: "File (multipart/form-data)"
          },
    response: { success: "boolean",
                message: "string",
                consumer: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/consumer/change-password",
    body: { currentPassword: "string",
            newPassword: "string",
            confirmPassword: "string"
          },
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "GET",
    url: "/api/v1/consumer/view-all-category",
    response: { success: "boolean",
                message: "string",
                categories: "array"
              }
  },

  {
    method: "GET",
    url: "/api/v1/consumer/products",
    query: { page: "number (optional)",
             limit: "number (optional)",
             category: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                products: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/consumer/products/:productId",
    response: { success: "boolean",
                message: "string",
                product: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/consumer/retail-posts",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                posts: "array",
                pagination: "object"
              }
  },

  // ==================== PRODUCER ====================
  {
    method: "GET",
    url: "/api/v1/producer/profile",
    response: { success: "boolean",
                message: "string",
                producer: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/producer/profile",
    body: { name: "string",
            phone: "string",
            businessName: "string",
            address: "string"
          },
    response: { success: "boolean",
                message: "string",
                producer: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/producer/profile-image",
    body: { image: "File (multipart/form-data)"
          },
    response: { success: "boolean",
                message: "string",
                producer: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/producer/change-password",
    body: { currentPassword: "string",
            newPassword: "string",
            confirmPassword: "string"
          },
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "POST",
    url: "/api/v1/producer/createCategory",
    body: { name: "string",
            description: "string"
          },
    response: { success: "boolean",
                message: "string",
                category: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/producer/get-allcategory",
    response: { success: "boolean",
                message: "string",
                categories: "array"
              }
  },

  {
    method: "POST",
    url: "/api/v1/producer/add-product",
    body: { name: "string",
            description: "string",
            price: "number",
            category: "ObjectId",
            stock: "number",
            image: "File (multipart/form-data)"
          },
    response: { success: "boolean",
                message: "string",
                product: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/producer/products",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                products: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/producer/products/:productId",
    response: { success: "boolean",
                message: "string",
                product: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/producer/products/:productId",
    body: { name: "string",
            description: "string",
            price: "number",
            stock: "number",
            category: "ObjectId"
          },
    response: { success: "boolean",
                message: "string",
                product: "object"
              }
  },

  {
    method: "DELETE",
    url: "/api/v1/producer/products/:productId",
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "GET",
    url: "/api/v1/producer/selling-requests",
    query: { page: "number (optional)",
             limit: "number (optional)",
             status: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                requests: "array",
                pagination: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/producer/confirm-selling/:productId",
    body: { quantity: "number",
            price: "number"
          },
    response: { success: "boolean",
                message: "string",
                product: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/producer/notifications/",
    query: { page: "number (optional)",
             limit: "number (optional)",
             isRead: "boolean (optional)"
           },
    response: { success: "boolean",
                message: "string",
                notifications: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/producer/notifications/unread-count",
    response: { success: "boolean",
                message: "string",
                unreadCount: "number"
              }
  },

  {
    method: "PATCH",
    url: "/api/v1/producer/notifications/:notificationId/read",
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "PATCH",
    url: "/api/v1/producer/notifications/mark-all-read",
    response: { success: "boolean",
                message: "string"
              }
  },

  // ==================== WHOLESALER ====================
  {
    method: "GET",
    url: "/api/v1/wholesaler/profile",
    response: { success: "boolean",
                message: "string",
                wholesaler: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/wholesaler/profile",
    body: { name: "string",
            phone: "string",
            businessName: "string",
            address: "string"
          },
    response: { success: "boolean",
                message: "string",
                wholesaler: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/wholesaler/profile-image",
    body: { image: "File (multipart/form-data)"
          },
    response: { success: "boolean",
                message: "string",
                wholesaler: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/wholesaler/change-password",
    body: { currentPassword: "string",
            newPassword: "string",
            confirmPassword: "string"
          },
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "GET",
    url: "/api/v1/wholesaler/products/approved",
    query: { page: "number (optional)",
             limit: "number (optional)",
             category: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                products: "array",
                pagination: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/wholesaler/products/sell/:productId",
    body: { quantity: "number",
            wholesalePrice: "number"
          },
    response: { success: "boolean",
                message: "string",
                product: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/wholesaler/bulk-posts",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                posts: "array",
                pagination: "object"
              }
  },

  // ==================== SUPERSELLER ====================
  {
    method: "GET",
    url: "/api/v1/supersaler/profile",
    response: { success: "boolean",
                message: "string",
                superseller: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/supersaler/profile",
    body: { name: "string",
            phone: "string",
            businessName: "string",
            address: "string"
          },
    response: { success: "boolean",
                message: "string",
                superseller: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/supersaler/profile-image",
    body: { image: "File (multipart/form-data)"
          },
    response: { success: "boolean",
                message: "string",
                superseller: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/supersaler/change-password",
    body: { currentPassword: "string",
            newPassword: "string",
            confirmPassword: "string"
          },
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "GET",
    url: "/api/v1/supersaler/products/approved",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                products: "array",
                pagination: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/supersaler/products/sell/:productId",
    body: { quantity: "number",
            sellingPrice: "number"
          },
    response: { success: "boolean",
                message: "string",
                product: "object"
              }
  },

  {
    method: "POST",
    url: "/api/v1/supersaler/sell-post/create",
    body: { title: "string",
            description: "string",
            productId: "ObjectId",
            quantity: "number",
            price: "number"
          },
    response: { success: "boolean",
                message: "string",
                sellPost: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/supersaler/bulk-posts",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                posts: "array",
                pagination: "object"
              }
  },

  {
    method: "POST",
    url: "/api/v1/supersaler/add",
    body: { productId: "ObjectId",
            quantity: "number",
            price: "number"
          },
    response: { success: "boolean",
                message: "string",
                cart: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/supersaler/",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                cart: "object"
              }
  },

  {
    method: "POST",
    url: "/api/v1/supersaler/cart/checkout/init",
    body: { orderId: "ObjectId",
            totalAmount: "number",
            paymentMethod: "ssl_commerz"
          },
    response: { success: "boolean",
                message: "string",
                paymentData: "object"
              }
  },

  {
    method: "POST",
    url: "/api/v1/supersaler/ssl-success",
    body: { transactionId: "string",
            orderId: "ObjectId",
            amount: "number"
          },
    response: { success: "boolean",
                message: "string",
                order: "object"
              }
  },

  {
    method: "POST",
    url: "/api/v1/supersaler/ssl-fail",
    body: { transactionId: "string",
            orderId: "ObjectId"
          },
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "POST",
    url: "/api/v1/supersaler/ssl-cancel",
    body: { transactionId: "string",
            orderId: "ObjectId"
          },
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "POST",
    url: "/api/v1/supersaler/cart/checkout/cod",
    body: { orderId: "ObjectId",
            totalAmount: "number",
            shippingAddress: "string"
          },
    response: { success: "boolean",
                message: "string",
                order: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/supersaler/orders/buy",
    query: { page: "number (optional)",
             limit: "number (optional)",
             status: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                orders: "array",
                pagination: "object"
              }
  },

  {
    method: "POST",
    url: "/api/v1/supersaler/product/create",
    body: { name: "string",
            description: "string",
            price: "number",
            stock: "number",
            category: "ObjectId",
            image: "File (multipart/form-data)"
          },
    response: { success: "boolean",
                message: "string",
                product: "object"
              }
  },

  // ==================== ADMIN ====================
  {
    method: "GET",
    url: "/api/v1/admin/profile",
    response: { success: "boolean",
                message: "string",
                admin: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/admin/profile",
    body: { name: "string",
            phone: "string"
          },
    response: { success: "boolean",
                message: "string",
                admin: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/admin/profile-image",
    body: { image: "File (multipart/form-data)"
          },
    response: { success: "boolean",
                message: "string",
                admin: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/admin/change-password",
    body: { currentPassword: "string",
            newPassword: "string",
            confirmPassword: "string"
          },
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/users",
    query: { page: "number (optional)",
             limit: "number (optional)",
             userType: "string (optional)",
             search: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                users: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/users/:id",
    response: { success: "boolean",
                message: "string",
                user: "object"
              }
  },

  {
    method: "DELETE",
    url: "/api/v1/admin/users/:id",
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/all-consumer/",
    query: { page: "number (optional)",
             limit: "number (optional)",
             search: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                consumers: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/all-consumer/:id",
    response: { success: "boolean",
                message: "string",
                consumer: "object"
              }
  },

  {
    method: "DELETE",
    url: "/api/v1/admin/all-consumer/:id",
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/search",
    query: { query: "string",
             userType: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                results: "array"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/all-supersaler/pending",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                supersellers: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/all-supersaler",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                supersellers: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/all-supersaler/search",
    query: { query: "string"
           },
    response: { success: "boolean",
                message: "string",
                results: "array"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/all-supersaler/:id",
    response: { success: "boolean",
                message: "string",
                superseller: "object"
              }
  },

  {
    method: "DELETE",
    url: "/api/v1/admin/all-supersaler/:id",
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/admin/all-supersaler/approve/:id",
    body: { status: "approved"
          },
    response: { success: "boolean",
                message: "string",
                superseller: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/all-wholesalers",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                wholesalers: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/all-wholesalers/search",
    query: { query: "string"
           },
    response: { success: "boolean",
                message: "string",
                results: "array"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/all-wholesalers/:id",
    response: { success: "boolean",
                message: "string",
                wholesaler: "object"
              }
  },

  {
    method: "DELETE",
    url: "/api/v1/admin/all-wholesalers/:id",
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/pending-wholesalers",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                wholesalers: "array",
                pagination: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/admin/approve-wholesaler/:id",
    body: { status: "approved"
          },
    response: { success: "boolean",
                message: "string",
                wholesaler: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/all-producer",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                producers: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/all-producer/search",
    query: { query: "string"
           },
    response: { success: "boolean",
                message: "string",
                results: "array"
              }
  },

  {
    method: "DELETE",
    url: "/api/v1/admin/all-producer/:id",
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/all-producer/:id",
    response: { success: "boolean",
                message: "string",
                producer: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/pending-producers",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                producers: "array",
                pagination: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/admin/approve-producer/:id",
    body: { status: "approved"
          },
    response: { success: "boolean",
                message: "string",
                producer: "object"
              }
  },

  {
    method: "DELETE",
    url: "/api/v1/admin/all-products/:id",
    response: { success: "boolean",
                message: "string"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/products/pending",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                products: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/products/approved",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                products: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/products/rejected",
    query: { page: "number (optional)",
             limit: "number (optional)"
           },
    response: { success: "boolean",
                message: "string",
                products: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/products/all",
    query: { page: "number (optional)",
             limit: "number (optional)",
             status: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                products: "array",
                pagination: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/products/:productId",
    response: { success: "boolean",
                message: "string",
                product: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/admin/products/approve/:productId",
    body: { status: "approved"
          },
    response: { success: "boolean",
                message: "string",
                product: "object"
              }
  },

  {
    method: "PUT",
    url: "/api/v1/admin/products/reject/:productId",
    body: { status: "rejected",
            rejectionReason: "string"
          },
    response: { success: "boolean",
                message: "string",
                product: "object"
              }
  },

  {
    method: "GET",
    url: "/api/v1/admin/sell-posts",
    query: { page: "number (optional)",
             limit: "number (optional)",
             status: "string (optional)"
           },
    response: { success: "boolean",
                message: "string",
                sellPosts: "array",
                pagination: "object"
              }
  }
];

export default apiList;

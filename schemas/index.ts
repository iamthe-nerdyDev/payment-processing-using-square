/**
 * @swagger
 * components:
 *  schemas:
 *      ErrorSchema:
 *          type: object
 *          properties:
 *              status:
 *                  type: boolean
 *              error:
 *                  type: object
 *                  properties:
 *                      type:
 *                          type: string
 *                      message:
 *                          type: string
 *                      stack:
 *                          type: string
 *
 *      AuthorizationTokensSchema:
 *          type: object
 *          properties:
 *              status:
 *                  type: boolean
 *              message:
 *                  type: string
 *              data:
 *                  type: object
 *                  properties:
 *                      tokens:
 *                          type: object
 *                          properties:
 *                              access_token:
 *                                  type: string
 *                              refresh_token:
 *                                  type: string
 *
 *      AddCardSchema:
 *          type: object
 *          required:
 *              - cardToken
 *              - verificationToken
 *              - cardholderName
 *          properties:
 *              cardToken:
 *                  type: string
 *              verificationToken:
 *                  type: string
 *              cardholderName:
 *                  type: string
 *
 *      InitPaymentSchema:
 *          type: object
 *          required:
 *              - cardId
 *              - amount
 *              - currency
 *          properties:
 *              cardId:
 *                  type: number
 *              amount:
 *                  type: number
 *              currency:
 *                  type: string
 *
 *      SignInSchema:
 *          type: object
 *          required:
 *              - emailAddress
 *              - password
 *          properties:
 *              emailAddress:
 *                  type: string
 *                  default: user@example.com
 *              password:
 *                  type: string
 *                  default: 1234567
 *
 *      SignUpSchema:
 *          type: object
 *          required:
 *              - firstName
 *              - lastName
 *              - emailAddress
 *              - password
 *              - confirmPassword
 *          properties:
 *              firstName:
 *                  type: string
 *                  default: John
 *              lastName:
 *                  type: string
 *                  default: Doe
 *              emailAddress:
 *                  type: string
 *                  default: user@example.com
 *              password:
 *                  type: string
 *                  default: 1234567
 *              confirmPassword:
 *                  type: string
 *                  default: 1234567
 *
 *      UserSchema:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *              firstName:
 *                  type: string
 *              lastName:
 *                  type: string
 *              emailAddress:
 *                  type: string
 *              createdAt:
 *                  type: string
 *              updatedAt:
 *                  type: string
 *              cards:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/CardSchemaWithPayment'
 *
 *      CardSchemaWithPayment:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *              enabled:
 *                  type: boolean
 *              last4:
 *                  type: string
 *              cardholderName:
 *                  type: string
 *              cardBrand:
 *                  type: string
 *              cardType:
 *                  type: string
 *              expMonth:
 *                  type: number
 *              expYear:
 *                  type: number
 *              createdAt:
 *                  type: string
 *              updatedAt:
 *                  type: string
 *              payments:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/PaymentSchema'
 *
 *      CardSchema:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *              enabled:
 *                  type: boolean
 *              last4:
 *                  type: string
 *              cardholderName:
 *                  type: string
 *              cardBrand:
 *                  type: string
 *              cardType:
 *                  type: string
 *              expMonth:
 *                  type: number
 *              expYear:
 *                  type: number
 *              createdAt:
 *                  type: string
 *              updatedAt:
 *                  type: string
 *
 *      PaymentSchema:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *              reference:
 *                  type: string
 *              amount:
 *                  type: number
 *              currency:
 *                  type: string
 *              status:
 *                  type: string
 *              createdAt:
 *                  type: string
 *              updatedAt:
 *                  type: string
 *
 *      SessionSchema:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *              device:
 *                  type: string
 *              ip:
 *                  type: string
 *              isActive:
 *                  type: boolean
 *              createdAt:
 *                  type: string
 *              updatedAt:
 *                  type: string
 *
 *      PaginationSchema:
 *          type: object
 *          properties:
 *              limit:
 *                  type: number
 *              currentPage:
 *                  type: number
 *              offset:
 *                  type: number
 *              totalPages:
 *                  type: number
 *              totalRows:
 *                  type: number
 *
 */

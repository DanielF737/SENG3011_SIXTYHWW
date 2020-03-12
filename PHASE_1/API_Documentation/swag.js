/**
 * @swagger
 *paths:
 * /search:
 *    get:
 *      tags:
 *        - "Search"
 *      summary: "Search query for articles"
 *      description: ""
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: startDate
 *          in: query
 *          description: "start date for search"
 *          required: true
 *          type: string
 *        - name: endDate
 *          in: query
 *          description: "endDate date for search"
 *          required: true
 *          type: string
 *        - name: keyTerms
 *          in: query
 *          description: "key terms date for search"
 *          required: true
 *          type: string
 *        - name: location
 *          in: query
 *          description: "location date for search"
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *            description: Success
 *        400:
 *            description: something failed
 * /articles:
 *    get:
 *      tags:
 *        - "Articles"
 *      summary: "Get N most recent articles"
 *      description: ""
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: N
 *          in: query
 *          description: "Number of articles to yoink"
 *          required: false
 *          type: int
 *          default: 20
 *      responses:
 *        200:
 *            description: Success
 *        400:
 *            description: something failed
 * /articles/{id}:
 *    get:
 *      tags:
 *        - "Articles"
 *      summary: "Get Article by ID"
 *      description: ""
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: id
 *          in: path
 *          description: "ID of article to be fetched"
 *          required: true
 *          type: int
 *          minimum: 0
 *      responses:
 *        200:
 *            description: Success
 *        400:
 *            description: Invalid ID
 *        404:
 *            description: Article not found
 ** /articles/{id}:
 *    put:
 *      tags:
 *        - "Articles"
 *      summary: "Get Article by ID"
 *      description: ""
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: id
 *          in: path
 *          description: "ID of article to be fetched"
 *          required: true
 *          type: int
 *          minimum: 0
 *      responses:
 *        200:
 *            description: Success
 *        400:
 *            description: Invalid ID
 *        404:
 *            description: Article not found

 *    delete:
 *      tags:
 *        - "Articles"
 *      summary: "Delete Article by ID"
 *      description: ""
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: id
 *          in: path
 *          description: "ID of article to be deleted"
 *          required: true
 *          type: int
 *          minimum: 0
 *      responses:
 *        400:
 *            description: Invalid ID
 *        404:
 *            description: Article not found
 *
 *
 *
 *
 *
 *
 *
 */


// import { gql } from '@apollo/client'

export class QUERIES {
    static QUERY_Get_All = () => `
        query MyQuery {
            movies_movies {
                title
                director
                budget
                gross
                id
                user_id
            }
        }`

    static MUTATION_Insert = (title, director, budget, gross) =>
        `mutation MyMutation {
            insert_movies_movies(objects: {title: "${title}", director: "${director}", budget: "${budget}", gross: "${gross}"}) {
                returning {
                    title
                    director
                    budget
                    gross
                    id
                }
            }
        }
    `

    static MUTATION_Delete = (title) =>
        `mutation MyMutation {
            delete_movies_movies(where: {title: {_eq: "${title}"}}) {
                affected_rows
                returning {
                    budget
                    director
                    gross
                    id
                    title
                }
            }
        }
    `
}

const debug = require('debug')('ranking datamapper');
const client = require('../config/db');

/**
 * @typedef {object} Score
 */

module.exports = {
/**
     * Récupère par son id
     * @param {number} id - L'id home
     * @returns {(Users|undefined)} -
     * Les users d'une home à cet home id
     */

  async findUsersByHomeID(homeId) {
    debug('dans findUsersByHomeID');
    // query for my home users
    const result = await client.query(
      `select home.id as home_id, "user".id,"user".avatar_img,"user".pseudonym,"user".email
 
      from home
      LEFT JOIN "user"        ON  home.id = "user".home_id
      group by home.id,"user".id
      having home.id =$1`,
      [homeId],
    );
    // debug(result.rows);

    if (result.rowCount === 0) {
      return undefined;
    }

    return result.rows;
  },
  /**
     * Récupère par son id
     * @param {number} id - L'id home
     * @returns {(Users|undefined)} -
     * Les users d'une home à cet home id
     */

  async findUsersEmailByHomeID(homeId) {
    debug('dans findUsersEmailByHomeID');
    // query for my home users
    const result = await client.query(
      `select home.id as home_id, "user".id,"user".email,"user".pseudonym
 
      from home
      LEFT JOIN "user"        ON  home.id = "user".home_id
      group by home.id,"user".id
      having home.id =$1`,
      [homeId],
    );
    // debug(result.rows);

    if (result.rowCount === 0) {
      return undefined;
    }

    return result.rows;
  },
  /**
     * Récupère par son id
     * @param {number} id - L'id home
     * @returns {(Score|undefined)} -
     * La Score souhaité ou undefined si aucun home à cet id
     */

  async score(homeId) {
    debug('dans score');
    // score for my home
    const result = await client.query(
      `select done_task.home_id,"user".id as id, SUM(done_task.value) as score ,"user".pseudonym,"user".avatar_img

      from "user"
      left join "done_task" on  "user".id=done_task.user_id
      left join "home" on  "user".id=home.user_id

      where to_char(done_task.created_at,'YYYY') = to_char(now(),'YYYY')
            AND to_char(done_task.created_at,'WW') = to_char(now(),'WW')

      group by "user".id,done_task.home_id
having done_task.home_id = $1
   
  order by score desc`,
      [homeId],
    );
    // debug(result.rows);

    if (result.rowCount === 0) {
      return undefined;
    }

    return result.rows;
  },
};

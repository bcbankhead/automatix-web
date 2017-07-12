//data.js
const dataRules = [
  {
    "id":135,
    "vivid_id":9595441,
    "event_date":"2017-06-03T00:00:00-06:00",
    "starting_quantity":2,
    "starting_price":220,
    "section_name":"128",
    "stubhub_event_id":9693609,
    "row":"20",
    "seats":"14,15",
    "split":"2",
    "venue_id":43,
    "pricing_rule":
    {
      "id":151,
      "ticket_group_id":135,
      "floor_price":220,
      "ceiling_price":250,
      "lowest_by":1,
      "highest_by":null,
      "created_at":"2017-06-07T02:55:22.746Z"
    },
      "price_updates":
        [
          {
            "id":157,
            "ticket_group_id":135,
            "state":"inactive",
            "root_price_update_id":null,
            "parent_price_update_id":null,
            "current_price":190,
            "current_quantity":2,
            "reprice_interval":null,
            "rules":null,
            "created_at":"2017-06-07T02:55:22.727Z",
            "updated_at":"2017-06-07T02:55:22.727Z",
            "pricing_rule_id":null
          },
          {
            "id":159,
            "ticket_group_id":135,
            "state":"active",
            "root_price_update_id":null,
            "parent_price_update_id":null,
            "current_price":220,
            "current_quantity":2,
            "reprice_interval":null,
            "rules":null,
            "created_at":"2017-06-07T02:55:22.727Z",
            "updated_at":"2017-06-07T02:55:22.727Z",
            "pricing_rule_id":null
          }
        ]
      },
  {
    "id":136,
    "vivid_id":9595442,
    "event_date":"2017-06-03T00:00:00-06:00",
    "starting_quantity":4,
    "starting_price":"235",
    "section_name":"128",
    "stubhub_event_id":9693609,
    "row":"14",
    "seats":"13,14,15,16",
    "split":"4",
    "venue_id":43,
    "pricing_rule":
    {
      "id":151,
      "ticket_group_id":136,
      "floor_price":"235",
      "ceiling_price":280,
      "lowest_by":1,
      "highest_by":null,
      "created_at":"2017-06-07T02:55:22.746Z"
    },
      "price_updates":
        [
          {
            "id":158,
            "ticket_group_id":136,
            "state":"inactive",
            "root_price_update_id":null,
            "parent_price_update_id":null,
            "current_price":"235",
            "current_quantity":2,
            "reprice_interval":null,
            "rules":null,
            "created_at":"2017-06-07T02:55:22.727Z",
            "updated_at":"2017-06-07T02:55:22.727Z",
            "pricing_rule_id":null
          }
        ]
      }
    ]
module.exports = dataRules;

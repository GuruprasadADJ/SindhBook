const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
  father        :Array,
  mother        :Array,
  daughter      :Array,
  son           :Array,
  sister        :Array,
  brother       :Array,
  auntie        :Array,
  uncle         :Array,
  cousin_male   :Array,
  cousin_female :Array,
  grandmother   :Array,
  grandfather   :Array,
  grandson      :Array,
  granddaughter :Array,
  husband       :Array,
  wife          :Array,
  nephew        :Array,
  neice         :Array,
});
module.exports = mongoose.model("relations_list", NoteSchema);
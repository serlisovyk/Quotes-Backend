import { STRING } from 'sequelize'
import sequelize from '#database'

const Category = sequelize.define('Category', {
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
})

export default Category

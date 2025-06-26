//src/models/Post.js
import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import slugify from 'slugify';

class PcoGrp {

  initSchema() {
    const schema = new Schema({
      title: {
        type: String,
        required: true,
      },
      slug: String,
      description: {
        type: String,
        required: false,
      }
    }, { timestamps: true })

    schema.pre(
      "save",
      function(next) {
        let post = this;
        if (!post.isModified("title")) {
          return next();
        }
        post.slug = slugify(post.title, "_");
        console.log('set slug', post.slug);
        return next();
      },
      function(err) {
        next(err);
      }
    )

    schema.plugin(uniqueValidator);
    mongoose.model("pcogrps", schema)
  }

  getInstance() {
    this.initSchema()
    return mongoose.model("pcogrps")
  }
}

exports PcoGrp;

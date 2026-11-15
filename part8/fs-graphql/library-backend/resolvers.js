const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const toGraphQLError = (error) => {
  if (!(error instanceof mongoose.Error.ValidationError)) {
    return error;
  }

  const details = Object.values(error.errors)
    .map(({ path, message }) => `${path}: ${message}`)
    .join("; ");

  return new GraphQLError(`Validation failed: ${details}`, {
    extensions: { code: "BAD_USER_INPUT" },
  });
};

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author }).select(
          "_id",
        );
        if (!author) {
          return [];
        }
        filter.author = author._id;
      }

      if (args.genre) {
        filter.genres = args.genre;
      }

      return Book.find(filter).populate("author");
    },
    authorCount: () => Author.collection.countDocuments(),
    allAuthors: async (root, args) => {
      return Author.find({});
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Book: {
    author: (book) => book.author,
  },
  Author: {
    bookCount: (author) => Book.countDocuments({ author: author._id }).exec(),
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated");
      }
      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
      });

      try {
        await book.validate();
      } catch (error) {
        throw toGraphQLError(error);
      }

      const bookExists = await Book.exists({ title: args.title });

      if (bookExists) {
        throw new GraphQLError(`Book must be unique: ${args.title}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
          },
        });
      }

      let author;

      if (args.author) {
        const newAuthor = new Author({ name: args.author });

        try {
          await newAuthor.validate();
        } catch (error) {
          throw toGraphQLError(error);
        }

        author = await Author.findOne({ name: args.author });

        if (!author) {
          author = newAuthor;
          try {
            await author.save();
          } catch (error) {
            throw toGraphQLError(error);
          }
        }
      }

      book.author = author?._id;

      try {
        await book.save();
      } catch (error) {
        throw toGraphQLError(error);
      }
      return book.populate("author");
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated");
      }

      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      return author.save();
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode");
      }
      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});
      return true;
    },
  },
};

module.exports = resolvers;

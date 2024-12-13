import "dotenv/config";

const DATABASE_URI = process.env.DATABASE_URI;
if (!DATABASE_URI) {
  throw new Error("DATABASE_URI não definido");
}

const ENV = {
  DATABASE_URI,
};

export default ENV;

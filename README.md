# Book Search Application

A Next.js application with Elasticsearch integration for searching and analyzing books. Features include full-text search, genre filtering, analytics dashboard, and auto-complete functionality.

## Prerequisites

- Docker (for Elasticsearch)
- Node.js 18 or higher
- npm, yarn, pnpm, or bun

## Setup Instructions

### 1. Start Elasticsearch

Launch Elasticsearch in a Docker container with single-node configuration and security disabled for development:

```bash
docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" -e "xpack.security.enabled=false" elasticsearch:9.1.2
```

This command:
- Runs Elasticsearch in detached mode (`-d`)
- Names the container "elasticsearch" for easy management
- Maps port 9200 for HTTP API access
- Configures single-node cluster for development
- Disables X-Pack security features for simplified local development

### 2. Install Dependencies

Install all required Node.js packages:

```bash
npm install
```

### 3. Start Development Server

Launch the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 4. Initialize Elasticsearch Index

Create the books index with proper field mappings by visiting:

```
http://localhost:3000/api/setup
```

This endpoint:
- Deletes any existing "books" index
- Creates a new index with optimized field mappings
- Configures the "genre" field as keyword type for aggregations
- Sets up proper data types for search and analytics

### 5. Seed Sample Data

Populate the index with sample book data by visiting:

```
http://localhost:3000/api/seed
```

This endpoint adds 200 sample books with diverse genres, authors, and metadata for testing search functionality.

## API Endpoints

- `/api/setup` - Initialize Elasticsearch index
- `/api/seed` - Populate with sample data
- `/api/search` - Full-text search with filters
- `/api/genres` - Get all unique genres
- `/api/suggestions` - Auto-complete suggestions
- `/api/analytics` - Search analytics and metrics

## Development Notes

The application requires Elasticsearch to be running before starting the Next.js server. Always run the setup endpoint after starting Elasticsearch to ensure proper index configuration.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

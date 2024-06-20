# Elysia + DrizzleORM + Lucia Auth template

Make sure you have Bun installed on your computer.

To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open `http://localhost:3000`

## How to run the app in container

1. Make sure you have Docker installed on your machine
2. Fill the environment variables
3. Run `docker build --pull -t [app_name] .`
4. If built successfully, run `docker run -p 3000:3000 [app_name]`
5. This will start running the app on localhost port 3000 so make sure you don't have any other application running on the same port.
6. Now you can use and test the API by going to `http://localhost:3000/api/[version]/[endpoint]`
7. To stop the container run `docker stop <container-id-or-name>` (you can check the ID or name of the container by running `docker ps`)
8. To remove the container run `docker rm <container-id-or-name>`
9. To remove the image and free up space on your locale machine run `docker rmi <image-id-or-repository:tag>` (you can check your images by running `docker images`)

- When you build a new version of your Docker image using the docker build command, it does not automatically update the running container. The running container continues to use the image version it was originally started with. To use the latest version of your image, you need to stop and remove the existing container, and then start a new container based on the updated image.

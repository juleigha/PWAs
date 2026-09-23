"""Arrange a folder of photos into fixed-size grid collages.

Splits a list of images into grid_size x grid_size collages (e.g. a 2x2
grid holds up to 4 photos per output image), resizing each photo to a
uniform size before pasting it in. Produces as many grid images as
needed to fit every input photo, saved as sequential JPEGs.
"""

import argparse
import math
import os

from PIL import Image

IMAGE_EXTENSIONS = (".png", ".jpg", ".jpeg", ".bmp", ".gif", ".webp")


def create_image_grids(image_paths, output_dir, grid_size=2, image_size=(200, 200)):
    """
    Create grid images with specified grid size and image size from a list of images.

    Parameters:
        image_paths (list): List of paths to input images.
        output_dir (str): Directory to save the generated grid images.
        grid_size (int): Number of images per row and column in the grid (default is 2 for a 2x2 grid).
        image_size (tuple): Target width and height for each image in the grid.

    Returns:
        None
    """
    os.makedirs(output_dir, exist_ok=True)

    num_images = len(image_paths)
    images_per_grid = grid_size ** 2
    num_grids = math.ceil(num_images / images_per_grid)

    for grid_index in range(num_grids):
        grid_image = Image.new('RGB', (image_size[0] * grid_size, image_size[1] * grid_size), color='white')

        for i in range(images_per_grid):
            img_index = grid_index * images_per_grid + i
            if img_index >= num_images:
                break

            img = Image.open(image_paths[img_index])
            img = img.resize(image_size)

            row, col = divmod(i, grid_size)
            pos_x = col * image_size[0]
            pos_y = row * image_size[1]

            grid_image.paste(img, (pos_x, pos_y))

        output_path = os.path.join(output_dir, f'grid_{grid_index + 1}.jpg')
        grid_image.save(output_path)
        print(f'Saved {output_path}')


def main():
    parser = argparse.ArgumentParser(description="Arrange a folder of photos into grid collages.")
    parser.add_argument("input_dir", help="Folder of images to collage")
    parser.add_argument("-o", "--output-dir", default="output/grids", help="Where to save the generated grids")
    parser.add_argument("-g", "--grid-size", type=int, default=2, help="Images per row/column (default: 2, i.e. a 2x2 grid)")
    parser.add_argument("--width", type=int, default=200, help="Width to resize each photo to (default: 200)")
    parser.add_argument("--height", type=int, default=200, help="Height to resize each photo to (default: 200)")
    args = parser.parse_args()

    image_paths = sorted(
        os.path.join(args.input_dir, f)
        for f in os.listdir(args.input_dir)
        if f.lower().endswith(IMAGE_EXTENSIONS)
    )

    if not image_paths:
        print(f"No images found in {args.input_dir}")
        return

    create_image_grids(image_paths, args.output_dir, args.grid_size, (args.width, args.height))


if __name__ == "__main__":
    main()

from PIL import Image
import math
import os

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
    # Make sure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    num_images = len(image_paths)
    images_per_grid = grid_size ** 2
    num_grids = math.ceil(num_images / images_per_grid)

    for grid_index in range(num_grids):
        # Create a blank grid canvas
        grid_image = Image.new('RGB', (image_size[0] * grid_size, image_size[1] * grid_size), color='white')

        # Process each image for the current grid
        for i in range(images_per_grid):
            img_index = grid_index * images_per_grid + i
            if img_index >= num_images:
                break  # No more images, leave blank spaces if needed
            
            # Open and resize the image
            img = Image.open(image_paths[img_index])
            img = img.resize(image_size)

            # Calculate position for the image on the grid
            row, col = divmod(i, grid_size)
            pos_x = col * image_size[0]
            pos_y = row * image_size[1]
            
            # Paste the image onto the grid
            grid_image.paste(img, (pos_x, pos_y))

        # Save the grid image
        output_path = os.path.join(output_dir, f'grid_{grid_index + 1}.jpg')
        grid_image.save(output_path)
        print(f'Saved {output_path}')

# Example usage:
# Specify paths to your images
path = "/Documents/dev/scrapbook"
# image_paths = [f for f in os.listdir(path) if os.isfile(os.join(path, f))]
print(os.getenv("HOME"))
print(os.listdir(f'/tmp/'))
# image_paths = [f'path/to/your/image_{i}.jpg' for i in range(1, 19)]  # Adjust with your actual image paths
output_dir = 'output/grids'
# create_image_grids(image_paths, output_dir, grid_size=2, image_size=(200, 200))

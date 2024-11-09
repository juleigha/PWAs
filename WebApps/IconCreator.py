import sys
import os
from PIL import Image

def resize_and_convert_icon(input_path, output_dir, sizes=[48, 72, 96, 192, 512]):
    """
    Convert a .webp image to .png and resize it to multiple icon sizes.

    Parameters:
        input_path (str): Path to the input .webp file.
        output_dir (str): Directory to save resized icons.
        sizes (list): List of sizes to resize the image to (square dimensions).

    Returns:
        None
    """
    # Load the image
    img = Image.open(input_path).convert("RGBA")

    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    for size in sizes:
        # Resize the image
        resized_img = img.resize((size, size), Image.LANCZOS)
        
        # Define the output path and save as PNG
        output_path = os.path.join(output_dir, f"icon-{size}.png")
        resized_img.save(output_path, "PNG")
        
        print(f"Saved resized icon: {output_path}")

if __name__ == "__main__":
    # Check if the correct number of arguments are provided
    if len(sys.argv) != 2:
        print("Usage: python resize_icons.py <input_image>")
        sys.exit(1)

    # Get input and output paths from command-line arguments
    input_image = sys.argv[1]
    output_directory = "pwa_icons/"

    # Execute the resizing and conversion
    resize_and_convert_icon(input_image, output_directory)

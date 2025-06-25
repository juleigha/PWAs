import sys
import os
from PIL import Image

def resize_and_convert_icon(input_path, output_dir, sizes=[48, 72, 96, 192, 512], screenshots=[]):
    """
    Converts .webp image to .png, resize it to multiple icon sizes, and generate screenshots.

    Parameters:
        input_path (str): Path to the input .webp file.
        output_dir (str): Directory to save resized icons and screenshots.
        sizes (list): List of sizes to resize the image to (square dimensions).
        screenshots (list): List of tuples for screenshot dimensions (width, height).

    Returns:
        None
    """
    img = Image.open(input_path).convert("RGBA")

    os.makedirs(output_dir, exist_ok=True)

    for size in sizes:
        resized_img = img.resize((size, size), Image.LANCZOS)
        output_path = os.path.join(output_dir, f"icon-{size}.png")
        resized_img.save(output_path, "PNG")
        print(f"Saved resized icon: {output_path}")

    for width, height in screenshots:
        resized_img = img.resize((width, height), Image.LANCZOS)
        output_path = os.path.join(output_dir, f"screenshot-{width}x{height}.png")
        resized_img.save(output_path, "PNG")
        print(f"Saved screenshot: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python resize_icons.py <input_image>")
        sys.exit(1)

    input_image = sys.argv[1]
    output_directory = "pwa_assets/"

    icon_sizes = [48, 72, 96, 192, 512]
    screenshot_dimensions = [(1080, 1920), (1920, 1080)]

    resize_and_convert_icon(input_image, output_directory, sizes=icon_sizes, screenshots=screenshot_dimensions)

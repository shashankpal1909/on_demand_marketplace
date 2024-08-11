from PIL import Image


def compress_image(image_path: str, output_path: str, quality: int = 85):
    with Image.open(image_path) as img:
        img.save(output_path, "JPEG", quality=quality)

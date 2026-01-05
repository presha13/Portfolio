
from collections import Counter
import sys

def get_dominant_colors(image_path, num_colors=5):
    try:
        import PIL
        from PIL import Image
        
        img = Image.open(image_path)
        img = img.resize((50, 50))
        img = img.convert('RGB')
        
        # getcolors returns (count, color)
        # For RGB, color is a (r, g, b) tuple
        colors = img.getcolors(50*50) 
        
        if colors is None:
            # If too many colors, getcolors returns None. fallback to manual counting
            pixels = list(img.getdata())
            colors = list(Counter(pixels).items())
            # colors is now [(color, count)] -> wait, Counter items are (key, count)
            # so we swap to match getcolors format (count, color)
            colors = [(count, color) for color, count in colors]
            
        sorted_colors = sorted(colors, key=lambda x: x[0], reverse=True)
        
        top_colors = sorted_colors[:num_colors]
        hex_colors = []
        for count, rgb in top_colors:
            h = '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])
            hex_colors.append(h)
            
        return hex_colors

    except ImportError:
        return "PIL not installed"
    except Exception as e:
        return f"Error: {str(e)}"

image_path = r"C:/Users/presh/.gemini/antigravity/brain/6e43a65e-216d-4754-b621-a6903eb74563/uploaded_image_1767003755881.png"
print(get_dominant_colors(image_path))

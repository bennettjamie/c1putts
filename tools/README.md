# YOLO Training Data Tools

Tools for collecting and preparing training data for the C1Putts vision model.

## Setup

```bash
pip install yt-dlp opencv-python
```

## Extract Frames from YouTube

```bash
python extract_frames.py "https://youtube.com/watch?v=VIDEO_ID" --output ./data --interval 30
```

Options:
- `--interval 30` = Extract every 30 frames (~1 per second at 30fps)
- `--output ./data` = Output directory

## Recommended YouTube Videos

Search these terms for putting practice videos:
- "disc golf putting practice"
- "disc golf putting drills"
- "disc golf putting form"
- "disc golf putting routine"

## After Extraction

1. Upload frames to Roboflow
2. Label objects with bounding boxes
3. Export as YOLO format
4. Train with Ultralytics YOLOv8

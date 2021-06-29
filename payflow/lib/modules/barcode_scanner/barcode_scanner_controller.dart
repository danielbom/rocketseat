import 'package:camera/camera.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:google_ml_kit/google_ml_kit.dart';
import 'package:image_picker/image_picker.dart';
import 'package:payflow/modules/barcode_scanner/barcode_scanner_status.dart';

class BarcodeScannerController {
  final status$ = ValueNotifier(BarcodeScannerStatus.available());

  BarcodeScannerStatus get status => this.status$.value;
  set status(BarcodeScannerStatus value) => this.status$.value = value;

  final barcodeScanner = GoogleMlKit.vision.barcodeScanner();
  CameraController? cameraController;

  void getAvailableCameras() async {
    try {
      final response = await availableCameras();
      final camera = response.firstWhere((element) => 
        element.lensDirection == CameraLensDirection.back);
      this.cameraController = CameraController(
        camera,
        ResolutionPreset.max,
        enableAudio: false
      );
      this.cameraController?.initialize();
      this.scanWithCamera();
      this.listenCamera();
    } catch (e) {
      this.status = BarcodeScannerStatus.error(e.toString());
    }
  }

  void scanWithCamera() {
    this.status = BarcodeScannerStatus.available();
    Future.delayed(Duration(seconds: 20)).then((value) {
      if (!this.status.hasBarcode) {
        this.status = BarcodeScannerStatus.error("Timeout de leitura de boleto");
      }
    });
  }

  void listenCamera() {
    if (this.cameraController == null) return;

    if (!this.cameraController!.value.isStreamingImages) {
      this.cameraController!.startImageStream((image) async {
        if (this.status.stopScanner) return;

        try {
          final allBytes = WriteBuffer();
          
          for (final plane in image.planes) 
            allBytes.putUint8List(plane.bytes);
          
          final bytes = allBytes.done().buffer.asUint8List();

          final size = Size(image.width.toDouble(), image.height.toDouble());
          final imageRotation = InputImageRotation.Rotation_0deg;
          final inputImageFormat = 
            InputImageFormatMethods.fromRawValue(image.format.raw) 
            ?? InputImageFormat.NV21;
          final planeData = image.planes.map((plane) {
            return InputImagePlaneMetadata(
              bytesPerRow: plane.bytesPerRow,
              height: plane.height,
              width: plane.width
            );
          }).toList();

          final inputImageData = InputImageData(
            size: size,
            inputImageFormat: inputImageFormat,
            planeData: planeData,
            imageRotation: imageRotation
          );
          final inputImageCamera = InputImage.fromBytes(
            bytes: bytes,
            inputImageData: inputImageData
          );
          this.scannerBarCode(inputImageCamera);
        } catch (e) {
          print(e);
        }
      });
    }
  }

  Future<void> scannerBarCode(InputImage inputImage) async {
    try {
      final barcodes = await this.barcodeScanner.processImage(inputImage);
      var barcode;
      for (final item in barcodes) {
        barcode = item.value.displayValue;
      }

      if (barcode != null && this.status.barcode.isEmpty) {
        this.status = BarcodeScannerStatus.barcode(barcode);
        this.cameraController!.dispose();
        await this.barcodeScanner.close();
      }
    } catch (e) {
      print(e);
    }
  }

  void scanWithImagePicker() async {
    final response = await ImagePicker().getImage(source: ImageSource.gallery);
    final inputImage = InputImage.fromFilePath(response!.path);
    this.scannerBarCode(inputImage);
  }

  void dispose() {
    this.status$.dispose();
    this.barcodeScanner.close();
    this.cameraController?.dispose();
  }
}

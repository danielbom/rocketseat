import 'package:flutter/material.dart';
import 'package:payflow/shared/themes/app_colors.dart';
import 'package:payflow/shared/themes/app_text_styles.dart';
import 'package:payflow/shared/widget/set_label_buttons/set_label_button.dart';

class BottomSheetWidget extends StatelessWidget {
  final String title;
  final String subtitle;

  final String firstLabel;
  final VoidCallback firstOnPress;
  final String secondLabel;
  final VoidCallback secondsOnPress;

  const BottomSheetWidget({
    Key? key,
    required this.title,
    required this.subtitle,
    required this.firstLabel,
    required this.firstOnPress,
    required this.secondLabel,
    required this.secondsOnPress,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final backgroundBlur = Expanded(
      child: Container(
        color: Colors.black.withOpacity(0.6)
      )
    );
    
    final description = Padding(
      padding: const EdgeInsets.all(40),
      child: Text.rich(
        TextSpan(
          text: this.title,
          style: TextStyles.buttonBoldHeading,
          children: [
            TextSpan(
              text: "\n${this.subtitle}",
              style: TextStyles.buttonHeading,
            )
          ],
        ),
        textAlign: TextAlign.center
      ),
    );
    final line = Container(
      height: 1,
      color: AppColors.stroke
    );
    final buttons = SetLabelButtons(
      highlightFirst: true,
      firstLabel: this.firstLabel,
      firstOnPress: this.firstOnPress,
      secondLabel: this.secondLabel,
      secondsOnPress: this.secondsOnPress,
    );

    return SafeArea(
      child: RotatedBox(
        quarterTurns: 1,
        child: Material(
          child: Container(
            color: AppColors.shape,
            child: Column(
              children: [
                backgroundBlur,
                Column(
                  children: [
                    description,
                    line,
                    buttons
                  ]
                ),
              ],
            ),
          ),
        )
      )
    );
  }
}

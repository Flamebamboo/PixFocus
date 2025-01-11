 import ActivityKit
import SwiftUI
import WidgetKit

struct FocusTimerAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var startTime: Date
        var endTime: Date
        var title: String
        var headline: String
        var widgetUrl: String
        var countsDown: Bool
    }
}

struct FocusTimerView: View {
    let context: ActivityViewContext<FocusTimerAttributes>

    var body: some View {
        VStack {
            Text(context.state.headline)
                .font(.headline)
            Text(context.state.title)
                .font(.title2)
            ProgressView(timerInterval: context.state.startTime...context.state.endTime,
                         countsDown: context.state.countsDown)
                .progressViewStyle(LinearProgressViewStyle())
        }
        .padding()
    }
}

struct FocusTimerWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: FocusTimerAttributes.self) { context in
            FocusTimerView(context: context)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.center) {
                    FocusTimerView(context: context)
                }
            } compactLeading: {
                // ...existing code...
            } compactTrailing: {
                // ...existing code...
            } minimal: {
                // ...existing code...
            }
            .widgetURL(URL(string: context.state.widgetUrl))
        }
    }
}

private extension FocusTimerAttributes {
    static var preview: FocusTimerAttributes {
        FocusTimerAttributes()
    }
}

private extension FocusTimerAttributes.ContentState {
    static var state: FocusTimerAttributes.ContentState {
        FocusTimerAttributes.ContentState(startTime: Date(timeIntervalSince1970: TimeInterval(1704300710)), endTime: Date(timeIntervalSince1970: TimeInterval(1704304310)), title: "Started at 11:54AM", headline: "Focus Timer in Progress", widgetUrl: "https://www.apple.com", countsDown: true)
    }
}

struct FocusTimerView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            FocusTimerAttributes.preview
                .previewContext(FocusTimerAttributes.ContentState.state, viewKind: .content)
                .previewDisplayName("Content View")

            FocusTimerAttributes.preview
                .previewContext(FocusTimerAttributes.ContentState.state, viewKind: .dynamicIsland(.compact))
                .previewDisplayName("Dynamic Island Compact")

            FocusTimerAttributes.preview
                .previewContext(FocusTimerAttributes.ContentState.state, viewKind: .dynamicIsland(.expanded))
                .previewDisplayName("Dynamic Island Expanded")

            FocusTimerAttributes.preview
                .previewContext(FocusTimerAttributes.ContentState.state, viewKind: .dynamicIsland(.minimal))
                .previewDisplayName("Dynamic Island Minimal")
        }
    }
}

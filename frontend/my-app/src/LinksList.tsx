import React from "react";
import { Spinner } from "react-bootstrap";

export type TFileObject = {
  [fileTitle: string]: string;
};

export interface ILinksListProps {
  filesData: TFileObject[];
  isLoading: boolean;
}

class LinksList extends React.Component<ILinksListProps> {
  render() {
    const { filesData, isLoading } = this.props;

    if (isLoading) {
      return <Spinner animation="border" />;
    }

    if (filesData !== [] && filesData !== undefined) {
      return filesData.map((fileData, index) => {
        const fileTitle = Object.keys(fileData)[0];
        return (
          <a
            key={index}
            href={`${fileData}`}
            onClick={() => {
              window.open(`http://localhost:5000/page/${fileData[fileTitle]}`);
            }}
            className="mb-3"
          >
            {fileTitle}
          </a>
        );
      });
    }

    if (filesData === []) {
      return (
        <span>Не удалось найти данные, удовлетворяющие вашему запросу.</span>
      );
    }

    return null;
  }
}

export default LinksList;
